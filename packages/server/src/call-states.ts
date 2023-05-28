import PQueue from 'p-queue';
import {
  PrismaClient,
  Podcast,
  Episode,
  EpisodeDownload,
  EpisodePart,
  CallState as StoredCallState
} from '@prisma/client';

import logger, { loggableError, omit } from './logger.js';
import { fetchLatestEpisode, downloadEpisode, chopEpisode, uploadEpisodeParts } from './podcast.js';
import { s3, bucketName, bucketBaseURL } from './s3.js';
import type { VoiceRequest } from './twilio-utilities.js';

const requestQueue = new PQueue({ concurrency: 1 });

export type PlayableDownload = EpisodeDownload & { episode: Episode, parts: EpisodePart[] };

interface FindingEpisode {
  status: 'finding-episode';
}

interface NoEpisode {
  status: 'no-episode';
}

interface EpisodeError {
  status: 'episode-error';
}

interface IntroducingEpisode {
  status: 'introducing-episode';
  playable: PlayableDownload;
}

interface PlayingEpisode {
  status: 'playing-episode';
  playable: PlayableDownload;
  part: EpisodePart;
}

interface EndingEpisode {
  status: 'ending-episode';
}

type CallState = FindingEpisode | PlayingEpisode | IntroducingEpisode | EndingEpisode | NoEpisode | EpisodeError;

interface InProgressCall {
  state: CallState;
  waitingMessageCount: number;
}

export async function enqueueNewCall(prisma: PrismaClient, podcast: Podcast, request: VoiceRequest) {
  const call = await prisma.call.create({
    data: {
      twilioCallSid: request.CallSid,
      state: StoredCallState.FETCHING_EPISODE,
      phoneNumber: request.From,
      callerName: request.CallerName,
      callerCity: request.FromCity,
      callerState: request.FromState,
      callerZip: request.FromZip,
      callerCountry: request.FromCountry,
    },
  });

  requestQueue.add(async () => {
    try {
      const episode = await fetchLatestEpisode(prisma, podcast);
      if (!episode) {
        logger.error('Unable to find latest episode');

        await prisma.call.update({
          where: { id: call.id },
          data: {
            state: StoredCallState.NO_EPISODE,
            download: { disconnect: true },
            currentPart: { disconnect: true },
          }
        });
        return;
      }

      // TODO: Consider race condition where we have an otherwise-valid in-progress download already going
      const existingDownload = await prisma.episodeDownload.findFirst({
        where: { episodeId: episode.id, finished: true },
        orderBy: { downloadDate: 'desc' },
        include: {
          episode: true,
          parts: { orderBy: { sortOrder: 'asc' } },
        },
      });

      let downloadToPlay: PlayableDownload;
      if (existingDownload
        && existingDownload.contentURL === episode.contentURL
        && existingDownload.parts.length > 0
      ) {
        logger.info(`Using existing download (${existingDownload.id}) of "${episode.title}"`, {
          download: omit(existingDownload, 'parts')
        });
        downloadToPlay = existingDownload;
      } else {
        if (existingDownload && existingDownload.contentURL !== episode.contentURL) {
          logger.info(`New contentURL for "${episode.title}". Downloading again`, {
            existingDownload: omit(existingDownload, 'parts')
          });
        } else if (existingDownload && existingDownload.contentURL !== episode.contentURL) {
          logger.warning(`No download parts for "${episode.title}". Downloading again`, {
            existingDownload: omit(existingDownload, 'parts')
          });
        }

        const now = new Date();
        const inProgressDownload = await prisma.episodeDownload.create({
          data: {
            episodeId: episode.id,
            contentURL: episode.contentURL,
            downloadDate: now,
            finished: false,
          },
          include: { episode: { include: { podcast: true } } },
        });

        const { filename } = await downloadEpisode(inProgressDownload);

        const tempFiles = await chopEpisode(inProgressDownload, filename);
        if (tempFiles.length === 0) {
          logger.warning(`No parts produced chopping ${filename}`, { download: inProgressDownload, filename })
          await prisma.call.update({
            where: { id: call.id },
            data: {
              state: StoredCallState.NO_EPISODE,
              download: { disconnect: true },
              currentPart: { disconnect: true },
            }
          });
          return;
        }

        const uploadedFiles = await uploadEpisodeParts(inProgressDownload, tempFiles, s3, bucketName, bucketBaseURL);

        downloadToPlay = await prisma.episodeDownload.update({
          where: { id: inProgressDownload.id },
          data: {
            finished: true,
            parts: {
              createMany: {
                data: uploadedFiles.map((part, index) => ({
                  sortOrder: index,
                  key: part.key,
                  url: part.url,
                })),
              },
            },
          },
          include: {
            episode: true,
            parts: { orderBy: { sortOrder: 'asc' } },
          },
        });
      }
      await prisma.call.update({
        where: { id: call.id },
        data: {
          state: StoredCallState.INTRODUCING_EPISODE,
          download: { connect: { id: downloadToPlay.id } },
          currentPart: { disconnect: true },
        }
      });

    } catch (error) {
      logger.error('Unable to download or process latest episode', { error: loggableError(error) });
      await prisma.call.update({
        where: { id: call.id },
        data: {
          state: StoredCallState.EPISODE_ERROR,
          download: { disconnect: true },
          currentPart: { disconnect: true },
        }
      });
      return;
    }
  });
}

export async function incrementCallWaitingMessageCount(prisma: PrismaClient, request: VoiceRequest) {
  await prisma.call.update({
    where: { twilioCallSid: request.CallSid },
    data: {
      waitingMessageCount: { increment: 1 },
    }
  });
}

export async function advanceToNextPart(prisma: PrismaClient, request: VoiceRequest) {
  const call = await prisma.call.findUniqueOrThrow({
    where: { twilioCallSid: request.CallSid },
    include: {
      download: {
        include: {
          parts: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
      },
      currentPart: true,
    },
  });

  if (call.state === StoredCallState.INTRODUCING_EPISODE) {
    if (!call.download) {
      logger.error('Missing download for INTRODUCING_EPISODE call', { call });
      throw new Error('Missing download for INTRODUCING_EPISODE call');
    }
    await prisma.call.update({
      where: { twilioCallSid: request.CallSid },
      data: {
        state: StoredCallState.PLAYING_EPISODE,
        currentPart: { connect: { id: call.download?.parts[0].id } }
      },
    });
  } else if (call.state === StoredCallState.PLAYING_EPISODE) {
    if (!call.download) {
      logger.error('Missing download for PLAYING_EPISODE call', { call });
      throw new Error('Missing download for PLAYING_EPISODE call');
    }
    if (!call.currentPart) {
      logger.error('Missing currentPart for PLAYING_EPISODE call', { call });
      throw new Error('Missing currentPart for PLAYING_EPISODE call');
    }

    const nextPart = await prisma.episodePart.findFirst({
      where: { download: { id: call.download.id }, sortOrder: { gt: call.currentPart.sortOrder } },
      orderBy: { sortOrder: 'asc' },
    });

    if (nextPart) {
      await prisma.call.update({
        where: { twilioCallSid: request.CallSid },
        data: {
          currentPart: { connect: { id: nextPart.id } },
        },
      });
    } else {
      await prisma.call.update({
        where: { twilioCallSid: request.CallSid },
        data: {
          state: StoredCallState.ENDING_EPISODE,
        },
      });
    }
  }
}

export async function getCallState(prisma: PrismaClient, request: VoiceRequest): Promise<InProgressCall | null> {
  const call = await prisma.call.findUnique({
    where: { twilioCallSid: request.CallSid },
    include: {
      download: {
        include: {
          episode: true,
          parts: true,
        }
      },
      currentPart: true,
    }
  });
  if (!call) {
    return null;
  }
  const { waitingMessageCount } = call;

  switch (call.state) {
    case StoredCallState.FETCHING_EPISODE:
      return { state: { status: 'finding-episode' }, waitingMessageCount };
    case StoredCallState.NO_EPISODE:
      return { state: { status: 'no-episode' }, waitingMessageCount };
    case StoredCallState.EPISODE_ERROR:
      return { state: { status: 'episode-error' }, waitingMessageCount };
    case StoredCallState.INTRODUCING_EPISODE:
      if (!call.download) {
        logger.error('Missing download for INTRODUCING_EPISODE call', { call });
        throw new Error('Missing download for INTRODUCING_EPISODE call');
      }
      return { state: { status: 'introducing-episode', playable: call.download }, waitingMessageCount };
    case StoredCallState.PLAYING_EPISODE:
      if (!call.download) {
        logger.error('Missing download for PLAYING_EPISODE call', { call });
        throw new Error('Missing download for PLAYING_EPISODE call');
      }
      if (!call.currentPart) {
        logger.error('Missing currentPart for PLAYING_EPISODE call', { call });
        throw new Error('Missing currentPart for PLAYING_EPISODE call');
      }
      return { state: { status: 'playing-episode', playable: call.download, part: call.currentPart }, waitingMessageCount };
    case StoredCallState.ENDING_EPISODE:
    case StoredCallState.ENDED:
      return { state: { status: 'ending-episode' }, waitingMessageCount };
  }
}

export async function endCallState(prisma: PrismaClient, request: VoiceRequest, duration: number | undefined) {
  await prisma.call.update({
    where: { twilioCallSid: request.CallSid },
    data: {
      state: StoredCallState.ENDED,
      callDuration: duration,
    },
  });
}

export function loggableStatus(status: InProgressCall | null): Record<string, any> | null {
  if (!status) {
    return null;
  }
  const { state, waitingMessageCount } = status;
  let loggableState: Record<string, any>;
  if ('playable' in state) {
    const { playable, ...rest } = state;
    const { parts, ...playableRest } = playable;
    loggableState = { ...rest, playable: { ... playableRest, partsCount: parts.length } };
  } else {
    loggableState = state;
  }
  return { state: loggableState, waitingMessageCount };
}

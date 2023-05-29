import PQueue from 'p-queue';
import {
  PrismaClient,
  Podcast,
  Episode,
  EpisodeDownload,
  EpisodePart,
  CallState as StoredCallState
} from '@prisma/client';

import logger, { loggableError, omit } from './logger';
import {
  fetchLatestEpisode,
  downloadEpisode,
  chopEpisode,
  uploadEpisodeParts,
  measureFiles,
  fileDurations
} from './podcast';
import { s3, bucketName, bucketBaseURL } from './s3';
import type { VoiceRequest } from './twilio-utilities';

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

export async function enqueueNewCall(prisma: PrismaClient, podcast: Podcast, request: Readonly<VoiceRequest>) {
  const now = new Date();
  const call = await prisma.call.create({
    data: {
      twilioCallSid: request.CallSid,
      events: {
        create: {
          date: now,
          state: StoredCallState.FETCHING_EPISODE,
          rawRequest: request,
        },
      },
      startDate: now,
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

        await prisma.callEvent.create({
          data: {
            call: { connect: { id: call.id } },
            date: new Date(),
            state: StoredCallState.NO_EPISODE,
            rawRequest: request,
          },
        });
        return;
      }

      // TODO: Consider race condition where we have an otherwise-valid in-progress download already going
      const existingDownload = await prisma.episodeDownload.findFirst({
        where: { episodeId: episode.id, finished: true, deleted: false },
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
          await prisma.callEvent.create({
            data: {
              call: { connect: { id: call.id } },
              date: new Date(),
              state: StoredCallState.NO_EPISODE,
              rawRequest: request,
            },
          });
          return;
        }

        const sizedTempFiles = await measureFiles(tempFiles);
        const durationedTempFiles = await fileDurations(sizedTempFiles);
        const uploadedFiles = await uploadEpisodeParts(inProgressDownload, durationedTempFiles, s3, bucketName, bucketBaseURL);

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
                  size: part.size,
                  duration: part.duration,
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
      await prisma.callEvent.create({
        data: {
          call: { connect: { id: call.id } },
          date: new Date(),
          state: StoredCallState.INTRODUCING_EPISODE,
          download: { connect: { id: downloadToPlay.id } },
          rawRequest: request,
        },
      });

    } catch (error) {
      logger.error('Unable to download or process latest episode', { error: loggableError(error) });
      await prisma.callEvent.create({
        data: {
          call: { connect: { id: call.id } },
          date: new Date(),
          state: StoredCallState.EPISODE_ERROR,
          rawRequest: request,
        },
      });
      return;
    }
  });
}

export async function incrementCallWaitingMessageCount(prisma: PrismaClient, request: Readonly<VoiceRequest>) {
  await prisma.callEvent.create({
    data: {
      call: { connect: { twilioCallSid: request.CallSid } },
      date: new Date(),
      state: StoredCallState.FETCHING_EPISODE,
      rawRequest: request,
    },
  });
}

export async function advanceToNextPart(prisma: PrismaClient, request: Readonly<VoiceRequest>) {
  const call = await prisma.call.findUniqueOrThrow({
    where: { twilioCallSid: request.CallSid },
    include: {
      events: {
        orderBy: { date: 'desc' },
        take: 1,
        include: {
          download: {
            include: {
              parts: { orderBy: { sortOrder: 'asc' }, take: 1 },
            }
          },
          currentPart: true,
        },
      },
    },
  });
  const event = call.events.at(0);
  if (!event) {
    logger.error('No events found for call', { call, request });
    throw new Error('No events found for call');
  }

  if (event.state === StoredCallState.INTRODUCING_EPISODE) {
    if (!event.download) {
      logger.error('Missing download for INTRODUCING_EPISODE event', { call });
      throw new Error('Missing download for INTRODUCING_EPISODE event');
    }
    await prisma.callEvent.create({
      data: {
        call: { connect: { twilioCallSid: request.CallSid } },
        date: new Date(),
        state: StoredCallState.PLAYING_EPISODE,
        download: { connect: { id: event.download.id } },
        currentPart: { connect: { id: event.download.parts[0].id } },
        rawRequest: request,
      },
    });
  } else if (event.state === StoredCallState.PLAYING_EPISODE) {
    if (!event.download) {
      logger.error('Missing download for PLAYING_EPISODE event', { call });
      throw new Error('Missing download for PLAYING_EPISODE event');
    }
    if (!event.currentPart) {
      logger.error('Missing currentPart for PLAYING_EPISODE event', { call });
      throw new Error('Missing currentPart for PLAYING_EPISODE event');
    }

    const nextPart = await prisma.episodePart.findFirst({
      where: { download: { id: event.download.id }, sortOrder: { gt: event.currentPart.sortOrder } },
      orderBy: { sortOrder: 'asc' },
    });

    if (nextPart) {
      await prisma.callEvent.create({
        data: {
          call: { connect: { twilioCallSid: request.CallSid } },
          date: new Date(),
          state: StoredCallState.PLAYING_EPISODE,
          download: { connect: { id: event.download.id } },
          currentPart: { connect: { id: nextPart.id } },
          rawRequest: request,
        },
      });
    } else {
      await prisma.callEvent.create({
        data: {
          call: { connect: { twilioCallSid: request.CallSid } },
          date: new Date(),
          state: StoredCallState.ENDING_EPISODE,
          rawRequest: request,
        },
      });
    }
  }
}

export async function getCallState(prisma: PrismaClient, request: Readonly<VoiceRequest>): Promise<InProgressCall | null> {
  const call = await prisma.call.findUnique({
    where: { twilioCallSid: request.CallSid },
    include: {
      events: {
        orderBy: { date: 'desc' },
        take: 1,
        include: {
          download: {
            include: {
              parts: { orderBy: { sortOrder: 'asc' }, take: 1 },
              episode: true,
            },
          },
          currentPart: true,
        },
      },
    },
  });

  if (!call) {
    return null;
  }

  const event = call.events.at(0);
  if (!event) {
    return null;
  }

  const fetchingCount = await prisma.callEvent.count({
    where: { call: { id: call.id }, state: StoredCallState.FETCHING_EPISODE },
  });
  const waitingMessageCount = fetchingCount - 1;

  switch (event.state) {
    case StoredCallState.FETCHING_EPISODE:
      return { state: { status: 'finding-episode' }, waitingMessageCount };
    case StoredCallState.NO_EPISODE:
      return { state: { status: 'no-episode' }, waitingMessageCount };
    case StoredCallState.EPISODE_ERROR:
      return { state: { status: 'episode-error' }, waitingMessageCount };
    case StoredCallState.INTRODUCING_EPISODE:
      if (!event.download) {
        logger.error('Missing download for INTRODUCING_EPISODE event', { call });
        throw new Error('Missing download for INTRODUCING_EPISODE event');
      }
      return { state: { status: 'introducing-episode', playable: event.download }, waitingMessageCount };
    case StoredCallState.PLAYING_EPISODE:
      if (!event.download) {
        logger.error('Missing download for PLAYING_EPISODE event', { call });
        throw new Error('Missing download for PLAYING_EPISODE event');
      }
      if (!event.currentPart) {
        logger.error('Missing currentPart for PLAYING_EPISODE event', { call });
        throw new Error('Missing currentPart for PLAYING_EPISODE event');
      }
      return { state: { status: 'playing-episode', playable: event.download, part: event.currentPart }, waitingMessageCount };
    case StoredCallState.ENDING_EPISODE:
    case StoredCallState.ENDED:
      return { state: { status: 'ending-episode' }, waitingMessageCount };
  }
}

export async function endCallState(prisma: PrismaClient, request: Readonly<VoiceRequest>, duration: number | undefined) {
  const now = new Date();
  await prisma.call.update({
    where: { twilioCallSid: request.CallSid },
    data: {
      callDuration: duration,
      endDate: now,
      events: {
        create: {
          date: now,
          state: StoredCallState.ENDED,
          rawRequest: request,
        }
      }
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

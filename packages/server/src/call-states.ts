import PQueue from 'p-queue';
import { PrismaClient, Podcast, Episode, EpisodeDownload, EpisodePart } from '@prisma/client';

import logger, { loggableError, omit } from './logger.js';
import { fetchLatestEpisode, downloadEpisode, chopEpisode, uploadEpisodeParts } from './podcast.js';
import { s3, bucketName, bucketBaseURL } from './s3.js';

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
  nextPartIndex: number;
}

interface EndingEpisode {
  status: 'ending-episode';
}

type CallState = FindingEpisode | PlayingEpisode | IntroducingEpisode | EndingEpisode | NoEpisode | EpisodeError;

interface InProgressCall {
  state: CallState;
  waitingMessageCount: number;
}

const callStates: Record<string, InProgressCall> = {};

export function enqueueNewCall(prisma: PrismaClient, podcast: Podcast, id: string) {
  updateCallState(id, { status: 'finding-episode' });
  requestQueue.add(async () => {
    try {
      const episode = await fetchLatestEpisode(prisma, podcast);
      if (!episode) {
        logger.error('Unable to find latest episode');
        updateCallState(id, { status: 'no-episode' });
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
          updateCallState(id, { status: 'no-episode' });
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
      updateCallState(id, { status: 'introducing-episode', playable: downloadToPlay });
    } catch (error) {
      logger.error('Unable to download or process latest episode', { error: loggableError(error) });
      updateCallState(id, { status: 'episode-error' });
      return;
    }
  });
}

function updateCallState(id: string, state: CallState) {
  const waitingMessageCount = callStates[id]?.waitingMessageCount ?? 0;
  callStates[id] = { state, waitingMessageCount };
}

export function incrementCallWaitingMessageCount(id: string) {
  const status = callStates[id];
  if (!status) {
    return;
  }
  const { state, waitingMessageCount } = status;
  callStates[id] = { state, waitingMessageCount: waitingMessageCount + 1 };
}

export function advanceToNextPart(id: string) {
  const status = callStates[id];
  if (!status) {
    return;
  }
  const { state } = status;
  if (state.status === 'introducing-episode') {
    const { playable } = state;
    updateCallState(id, { status: 'playing-episode', playable, nextPartIndex: 0 });
  } else if (state.status === 'playing-episode') {
    const { playable, nextPartIndex: partIndex } = state;
    const nextPartIndex = partIndex + 1;
    if (nextPartIndex >= playable.parts.length) {
      updateCallState(id, { status: 'ending-episode' });
    } else {
      updateCallState(id, { status: 'playing-episode', playable, nextPartIndex });
    }
  }
}

export function getCallState(id: string) {
  if (id in callStates) {
    return callStates[id];
  } else {
    return null;
  }
}

export function endCallState(id: string) {
  delete callStates[id];
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
    const part = ('nextPartIndex' in state)
      ? parts[state.nextPartIndex]
      : undefined;
    loggableState = { ...rest, playable: { ... playableRest, partsCount: parts.length }, part };
  } else {
    loggableState = state;
  }
  return { state: loggableState, waitingMessageCount };
}

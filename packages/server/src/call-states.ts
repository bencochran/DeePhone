import PQueue from 'p-queue';
import { PrismaClient, Podcast, Episode } from '@prisma/client';

import logger from './logger.js';
import { fetchLatestEpisode, downloadEpisode, chopEpisode, uploadEpisodeParts } from './podcast.js';
import type { DownloadedEpisode, UploadedPart } from './podcast.js';
import { s3, bucketName, bucketBaseURL } from './s3.js';

const requestQueue = new PQueue({ concurrency: 1 });

interface FetchingFeed {
  status: 'fetching-feed';
}

interface NoEpisode {
  status: 'no-episode';
}

interface EpisodeError {
  status: 'episode-error';
}

interface DownloadingEpisode {
  status: 'downloading-episode';
  episode: Episode;
}

interface SlicingEpisode {
  status: 'slicing-episode';
  episode: DownloadedEpisode;
}

interface IntroducingEpisode {
  status: 'introducing-episode';
  episode: DownloadedEpisode;
  parts: UploadedPart[];
}

interface PlayingEpisode {
  status: 'playing-episode';
  episode: DownloadedEpisode;
  parts: UploadedPart[];
  nextPartIndex: number;
}

interface EndingEpisode {
  status: 'ending-episode';
}

type CallState = FetchingFeed | DownloadingEpisode | SlicingEpisode | PlayingEpisode | IntroducingEpisode | EndingEpisode | NoEpisode | EpisodeError;

interface InProgressCall {
  state: CallState;
  waitingMessageCount: number;
}

const callStates: Record<string, InProgressCall> = {};

export function enqueueNewCall(prisma: PrismaClient, podcast: Podcast, id: string) {
  updateCallState(id, { status: 'fetching-feed' });
  requestQueue.add(async () => {
    try {
      const episode = await fetchLatestEpisode(prisma, podcast);
      if (!episode) {
        logger.warning('Unable to find latest episode');
        updateCallState(id, { status: 'no-episode' });
        return;
      }

      updateCallState(id, { status: 'downloading-episode', episode });
      const downloadedEpisode = await downloadEpisode(episode);

      updateCallState(id, { status: 'slicing-episode', episode: downloadedEpisode });
      const parts = await chopEpisode(downloadedEpisode);
      if (parts.length === 0) {
        updateCallState(id, { status: 'no-episode' });
        return;
      }

      const uploadedParts = await uploadEpisodeParts(episode, parts, s3, bucketName, bucketBaseURL);

      updateCallState(id, { status: 'introducing-episode', episode: downloadedEpisode, parts: uploadedParts });
    } catch (error) {
      logger.error('Unable to download or process latest episode', { error });
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
    const { episode, parts } = state;
    updateCallState(id, { status: 'playing-episode', episode, parts, nextPartIndex: 0 });
  } else if (state.status === 'playing-episode') {
    const { episode, parts, nextPartIndex: partIndex } = state;
    const nextPartIndex = partIndex + 1;
    if (nextPartIndex >= parts.length) {
      updateCallState(id, { status: 'ending-episode' });
    } else {
      updateCallState(id, { status: 'playing-episode', episode, parts, nextPartIndex });
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
  if ('parts' in state) {
    const { parts , ...rest } = state;
    const part = ('nextPartIndex' in state)
      ? parts[state.nextPartIndex]
      : undefined;
    loggableState = { ...rest, partsCount: parts.length, part };
  } else {
    loggableState = state;
  }
  return { state: loggableState, waitingMessageCount };
}

import PQueue from 'p-queue';

import logger from './logger.js';
import { fetchLatestEpisode, downloadEpisode, chopEpisode } from './podcast.js';
import type { Episode, DownloadedEpisode, Part } from './podcast.js';

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

interface PlayingEpisode {
  status: 'playing-episode';
  episode: DownloadedEpisode;
  parts: Part[];
}

type CallState = FetchingFeed | DownloadingEpisode | SlicingEpisode | PlayingEpisode | NoEpisode | EpisodeError;

interface InProgressCall {
  state: CallState;
  waitingMessageCount: number;
}

const callStates: Record<string, InProgressCall> = {};

export function enqueueNewCall(id: string) {
  updateCallState(id, { status: 'fetching-feed' });
  requestQueue.add(async () => {
    try {
      const episode = await fetchLatestEpisode();
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

      updateCallState(id, { status: 'playing-episode', episode: downloadedEpisode, parts });
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
    const { parts , ...rest} = state;
    loggableState = { ...rest, partsLeft: parts.length };
  } else {
    loggableState = state;
  }
  return { state: loggableState, waitingMessageCount };
}

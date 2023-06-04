import PQueue from 'p-queue';
import {
  PrismaClient,
  Podcast,
  Episode,
  EpisodeDownload,
  EpisodePart,
  CallEvent,
  Prisma,
  CallEventType,
  Call,
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
import type { VoiceRequest, VoiceStatusCallbackRequest } from './twilio-utilities';
import { pubsub } from './pubsub';

const requestQueue = new PQueue({ concurrency: 1 });

export type PlayableDownload = EpisodeDownload & { episode: Episode };

interface NoOp {
  type: 'no-op';
}

interface Introduction {
  type: 'introduction';
}

interface StillFetching {
  type: 'waiting';
  messageCount: number;
}

interface NoEpisode {
  type: 'no-episode';
}

interface EpisodeError {
  type: 'episode-error';
}

interface EpisodeIntroduction {
  type: 'episode-introduction';
  playable: PlayableDownload;
  waitingMessageCount: number;
}

interface EpisodePlayPart {
  type: 'episode-play-part';
  playable: PlayableDownload;
  part: EpisodePart;
}

interface Outro {
  type: 'outro';
}

interface HangUp {
  type: 'hang-up';
}

export type CallResponse = NoOp | Introduction | StillFetching | NoEpisode | EpisodeError | EpisodeIntroduction | EpisodePlayPart | Outro | HangUp;

function enqueueFetch(prisma: PrismaClient, podcast: Podcast, call: Call): void {
  requestQueue.add(async () => {
    try {
      const episode = await fetchLatestEpisode(prisma, podcast);
      if (!episode) {
        logger.error('Unable to find latest episode');

        const event = await prisma.callEvent.create({
          data: {
            call: { connect: { id: call.id } },
            date: new Date(),
            type: CallEventType.NO_EPISODE,
          },
        });
        pubsub.publish('callUpdated', call.id, { call, event });
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
        } else if (existingDownload && existingDownload.parts.length === 0) {
          logger.warning(`No download parts for "${episode.title}". Downloading again`, {
            existingDownload: omit(existingDownload, 'parts')
          });
        }

        const downloadStartDate = new Date();
        const inProgressDownload = await prisma.episodeDownload.create({
          data: {
            episodeId: episode.id,
            contentURL: episode.contentURL,
            downloadDate: downloadStartDate,
            finished: false,
          },
          include: { episode: { include: { podcast: true } } },
        });

        const { filename } = await downloadEpisode(inProgressDownload);

        const tempFiles = await chopEpisode(inProgressDownload, filename);
        if (tempFiles.length === 0) {
          logger.error(`No parts produced chopping ${filename}`, { download: inProgressDownload, filename });
          await prisma.callEvent.create({
            data: {
              call: { connect: { id: call.id } },
              date: new Date(),
              type: CallEventType.NO_EPISODE,
            },
          });
          return;
        }

        const sizedTempFiles = await measureFiles(tempFiles);
        const durationedTempFiles = await fileDurations(sizedTempFiles);
        const uploadedFiles = await uploadEpisodeParts(inProgressDownload, durationedTempFiles, s3, bucketName, bucketBaseURL);

        const downloadFinishDate = new Date();

        downloadToPlay = await prisma.episodeDownload.update({
          where: { id: inProgressDownload.id },
          data: {
            finished: true,
            downloadFinishDate,
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
      const event = await prisma.callEvent.create({
        data: {
          call: { connect: { id: call.id } },
          date: new Date(),
          type: CallEventType.EPISODE_READY,
          download: { connect: { id: downloadToPlay.id } },
        },
      });
      pubsub.publish('callUpdated', call.id, { call, event });
    } catch (error) {
      logger.error('Unable to download or process latest episode', { error: loggableError(error) });
      const event = await prisma.callEvent.create({
        data: {
          call: { connect: { id: call.id } },
          date: new Date(),
          type: CallEventType.EPISODE_ERROR,
        },
      });
      pubsub.publish('callUpdated', call.id, { call, event });
      return;
    }
  });
}

export async function handleVoiceRequest(prisma: PrismaClient, podcast: Podcast, request: Readonly<VoiceRequest>): Promise<CallResponse> {
  const handledDate = new Date();

  const call = await prisma.call.upsert({
    where: { twilioCallSid: request.CallSid },
    create: {
      twilioCallSid: request.CallSid,
      startDate: handledDate,
      phoneNumber: request.From,
      callerName: request.CallerName,
      callerCity: request.FromCity,
      callerState: request.FromState,
      callerZip: request.FromZip,
      callerCountry: request.FromCountry,
    },
    update: {},
    include: {
      events: {
        orderBy: { date: 'desc' },
        take: 1,
        include: {
          download: true,
          part: true,
        },
      },
    },
  });

  const lastEvent = call.events.at(0) ?? null;

  if (lastEvent && lastEvent.type === CallEventType.ANSWERED) {
    enqueueFetch(prisma, podcast, call);
    pubsub.publish('newCall', { call });
  }

  const nextEvent = await eventAfter(prisma, lastEvent);

  if (!nextEvent) {
    return { type: 'hang-up' };
  }

  const createdEvent = await prisma.callEvent.create({
    data: {
      date: handledDate,
      call: { connect: { id: call.id } },
      rawRequest: request,
      ...nextEvent,
    },
    include: {
      download: {
        include: {
          episode: true,
        },
      },
      part: true,
    }
  });
  pubsub.publish('callUpdated', call.id, { call, event: createdEvent });

  if (createdEvent.type === CallEventType.INTRODUCING_EPISODE && createdEvent.download?.episode) {
    pubsub.publish('episodeUpdated', createdEvent.download.episode.id, { episode: createdEvent.download.episode });
  }

  return await responseForEvent(
    createdEvent,
    (): Promise<number> => {
      return prisma.callEvent.count({
        where: {
          id: { not: createdEvent.id },
          call: { id: call.id },
          type: CallEventType.WAITING_MESSAGE,
        },
      });
    }
  );
}

export async function eventAfter(
  prisma: PrismaClient,
  event: CallEvent & {
    download: EpisodeDownload | null;
    part: EpisodePart | null;
  } | null
): Promise<Omit<Prisma.CallEventCreateInput, 'date' | 'call' | 'rawRequest'> | null> {
  if (!event) {
    return { type: CallEventType.ANSWERED };
  }

  switch (event.type) {
    case CallEventType.ANSWERED:
      return { type: CallEventType.FETCHING_EPISODE };
    case CallEventType.FETCHING_EPISODE:
      return { type: CallEventType.WAITING_MESSAGE };
    case CallEventType.EPISODE_READY:
      if (!event.download) {
        logger.error('Missing download for EPISODE_READY event', { event });
        return { type: CallEventType.EPISODE_ERROR };
      }
      return {
        type: CallEventType.INTRODUCING_EPISODE,
        download: { connect: { id: event.download.id } },
      };
    case CallEventType.WAITING_MESSAGE:
      return { type: CallEventType.WAITING_MESSAGE };
    case CallEventType.INTRODUCING_EPISODE:
      if (!event.download) {
        logger.error('Missing download for INTRODUCING_EPISODE event', { event });
        return { type: CallEventType.EPISODE_ERROR };
      }

      const firstPart = await prisma.episodePart.findFirst({
        where: {
          download: { id: event.download.id },
        },
        orderBy: { sortOrder: 'asc' },
      });

      if (!firstPart) {
        logger.error('Missing first part for download', { download: event.download });
        return { type: CallEventType.EPISODE_ERROR };
      }

      return {
        type: CallEventType.PLAYING_EPISODE,
        download: { connect: { id: event.download.id } },
        part: { connect: { id: firstPart.id }}
      };
    case CallEventType.PLAYING_EPISODE:
      if (!event.download) {
        logger.error('Missing download for PLAYING_EPISODE event', { event });
        return { type: CallEventType.EPISODE_ERROR };
      }
      if (!event.part) {
        logger.error('Missing part for PLAYING_EPISODE event', { event });
        return { type: CallEventType.EPISODE_ERROR };
      }
      const nextPart = await prisma.episodePart.findFirst({
        where: {
          download: { id: event.download.id },
          sortOrder: { gt: event.part.sortOrder },
        },
        orderBy: { sortOrder: 'asc' },
      });
      if (nextPart) {
        return {
          type: CallEventType.PLAYING_EPISODE,
          download: { connect: { id: event.download.id } },
          part: { connect: { id: nextPart.id } },
        };
      } else {
        return { type: CallEventType.ENDING_EPISODE };
      }
    case CallEventType.NO_EPISODE:
    case CallEventType.EPISODE_ERROR:
    case CallEventType.ENDING_EPISODE:
    case CallEventType.ENDED:
      return null;
  }
}

async function responseForEvent(
  event: CallEvent & {
    download: EpisodeDownload & {
      episode: Episode;
    } | null;
    part: EpisodePart | null;
  },
  getWaitingMessageCount: () => Promise<number>
): Promise<CallResponse> {
  switch (event.type) {
    case CallEventType.ANSWERED:
      return { type: 'no-op' };
    case CallEventType.FETCHING_EPISODE: {
      const messageCount = await getWaitingMessageCount()
      if (messageCount === 0) {
        return { type: 'introduction' };
      } else {
        return { type: 'waiting', messageCount };
      }
    }
    case CallEventType.EPISODE_READY:
      return { type: 'no-op' };
    case CallEventType.NO_EPISODE:
      return { type: 'no-episode' };
    case CallEventType.EPISODE_ERROR:
      return { type: 'episode-error' };
    case CallEventType.WAITING_MESSAGE: {
      return {
        type: 'waiting',
        messageCount: await getWaitingMessageCount(),
      };
    }
    case CallEventType.INTRODUCING_EPISODE:
      if (!event.download) {
        logger.error('Missing download for INTRODUCING_EPISODE event', { event });
        throw new Error(`Missing download for INTRODUCING_EPISODE event`);
      }
      return {
        type: 'episode-introduction',
        playable: event.download,
        waitingMessageCount: await getWaitingMessageCount(),
      };
    case CallEventType.PLAYING_EPISODE:
      if (!event.download) {
        logger.error('Missing download for PLAYING_EPISODE event', { event });
        throw new Error(`Missing download for PLAYING_EPISODE event`);
      }
      if (!event.part) {
        logger.error('Missing part for PLAYING_EPISODE event', { event });
        throw new Error(`Missing part for PLAYING_EPISODE event`);
      }
      return {
        type: 'episode-play-part',
        playable: event.download,
        part: event.part,
      };
    case CallEventType.ENDING_EPISODE:
      return { type: 'outro' };
    case CallEventType.ENDED:
      return { type: 'hang-up' };
  }
}

export async function handleCallStatus(prisma: PrismaClient, request: Readonly<VoiceStatusCallbackRequest>): Promise<void> {
  if (request.CallStatus === 'completed' || request.CallStatus === 'failed') {
    const now = new Date();
    const duration = Number(request.CallDuration);
    const call = await prisma.call.update({
      where: { twilioCallSid: request.CallSid },
      data: {
        callDuration: duration,
        endDate: now,
        events: {
          create: {
            date: now,
            type: CallEventType.ENDED,
            rawRequest: request,
          }
        }
      },
      include: {
        events: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });
    pubsub.publish('callUpdated', call.id, { call, event: call.events[0] });
  }
}

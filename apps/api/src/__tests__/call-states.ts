import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import {
  PrismaClient,
  CallEventType,
  EpisodeDownload,
  EpisodePart,
  Episode,
} from '@prisma/client';
import { Logger } from 'winston';

import { eventAfter, responseForEvent } from '../call-states';
import logger from '../logger';
import download from '../download';

jest.mock('../logger', () => ({
  __esModule: true,
  default: mockDeep<Logger>(),
}));

const date = new Date('1988-02-20T09:47:00-06:00');

describe('eventAfter', () => {
  const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
  const loggerMock = logger as unknown as DeepMockProxy<Logger>;

  beforeEach(() => {
    mockReset(prismaMock);
    mockReset(loggerMock);
  });

  describe('null', () => {
    it('Returns answered', async () => {
      const nextEvent = await eventAfter(prismaMock, null);

      expect(nextEvent).toBeDefined();
      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.ANSWERED,
      });
    });
  });

  describe('Answered', () => {
    it('Returns fetching', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.ANSWERED })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.FETCHING_EPISODE,
      });
    });
  });

  describe('Fetching episode', () => {
    it('Returns waiting', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.FETCHING_EPISODE })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.WAITING_MESSAGE,
      });
    });
  });

  describe('Waiting', () => {
    it('Returns waiting for waiting', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.WAITING_MESSAGE })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.WAITING_MESSAGE,
      });
    });
  });

  describe('Episode ready', () => {
    it('Returns introducing', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({
          type: CallEventType.EPISODE_READY,
          download: fakeDownload({ id: 42 }),
        })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.INTRODUCING_EPISODE,
        download: { connect: { id: 42 } },
      });
    });

    it('Returns error if no download is provided', async () => {
      const event = fakeEvent({ type: CallEventType.EPISODE_READY });
      const nextEvent = await eventAfter(prismaMock, event);

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.EPISODE_ERROR,
      });

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing download for EPISODE_READY event',
        { event }
      );
    });
  });

  describe('Introducing episode', () => {
    it('Returns playing first part', async () => {
      prismaMock.episodePart.findFirst.mockResolvedValue(fakePart({ id: 954 }));

      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({
          type: CallEventType.INTRODUCING_EPISODE,
          download: fakeDownload({ id: 345 }),
        })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.PLAYING_EPISODE,
        download: { connect: { id: 345 } },
        part: { connect: { id: 954 } },
      });

      expect(prismaMock.episodePart.findFirst).toHaveBeenCalledWith({
        where: {
          download: { id: 345 },
        },
        orderBy: { sortOrder: 'asc' },
      });
    });

    it('Returns error if no download is provided', async () => {
      const event = fakeEvent({ type: CallEventType.INTRODUCING_EPISODE });
      const nextEvent = await eventAfter(prismaMock, event);

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.EPISODE_ERROR,
      });

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing download for INTRODUCING_EPISODE event',
        { event }
      );
    });
  });

  describe('Playing episode', () => {
    it('Returns playing next part', async () => {
      prismaMock.episodePart.findFirst.mockResolvedValue(fakePart({ id: 391 }));

      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({
          type: CallEventType.PLAYING_EPISODE,
          download: fakeDownload({ id: 137 }),
          part: fakePart({ sortOrder: 620 }),
        })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.PLAYING_EPISODE,
        download: { connect: { id: 137 } },
        part: { connect: { id: 391 } },
      });

      expect(prismaMock.episodePart.findFirst).toHaveBeenCalledWith({
        where: {
          download: { id: 137 },
          sortOrder: { gt: 620 },
        },
        orderBy: { sortOrder: 'asc' },
      });
    });

    it('Returns ending episode if no next part', async () => {
      prismaMock.episodePart.findFirst.mockResolvedValue(null);

      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({
          type: CallEventType.PLAYING_EPISODE,
          download: fakeDownload({ id: 507 }),
          part: fakePart({ sortOrder: 743 }),
        })
      );

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.ENDING_EPISODE,
      });

      expect(prismaMock.episodePart.findFirst).toHaveBeenCalledWith({
        where: {
          download: { id: 507 },
          sortOrder: { gt: 743 },
        },
        orderBy: { sortOrder: 'asc' },
      });
    });

    it('Returns error if no download is provided', async () => {
      const event = fakeEvent({
        type: CallEventType.PLAYING_EPISODE,
        part: fakePart({ sortOrder: 994 }),
      });
      const nextEvent = await eventAfter(prismaMock, event);

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.EPISODE_ERROR,
      });

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing download for PLAYING_EPISODE event',
        { event }
      );
    });

    it('Returns error if no part is provided', async () => {
      const event = fakeEvent({
        type: CallEventType.PLAYING_EPISODE,
        download: fakeDownload({ id: 837 }),
      });
      const nextEvent = await eventAfter(prismaMock, event);

      expect(nextEvent).toStrictEqual<Output>({
        type: CallEventType.EPISODE_ERROR,
      });

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing part for PLAYING_EPISODE event',
        { event }
      );
    });
  });

  describe('Ending episode', () => {
    it('Returns null', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.ENDING_EPISODE })
      );

      expect(nextEvent).toBeNull();
    });
  });

  describe('No episode', () => {
    it('Returns null', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.ENDING_EPISODE })
      );

      expect(nextEvent).toBeNull();
    });
  });

  describe('Episode error', () => {
    it('Returns null', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.EPISODE_ERROR })
      );

      expect(nextEvent).toBeNull();
    });
  });

  describe('Ended', () => {
    it('Returns null', async () => {
      const nextEvent = await eventAfter(
        prismaMock,
        fakeEvent({ type: CallEventType.ENDED })
      );

      expect(nextEvent).toBeNull();
    });
  });

  //// Helpers

  type Input = Parameters<typeof eventAfter>[1];
  type Output = Awaited<ReturnType<typeof eventAfter>>;

  function fakeDownload<T extends Partial<EpisodeDownload>>(
    overrides: T
  ): T & EpisodeDownload {
    return {
      id: 300,
      episodeId: 400,
      contentURL: 'https://example.com',
      downloadDate: date,
      downloadFinishDate: date,
      finished: true,
      deleted: false,
      ...overrides,
    };
  }

  function fakePart<T extends Partial<EpisodePart>>(
    overrides: T
  ): T & EpisodePart {
    return {
      id: 500,
      downloadId: 300,
      sortOrder: 4,
      key: 'part-4.mp3',
      url: 'https://example.com/part-4.mp3',
      size: 1024,
      duration: 10,
      ...overrides,
    };
  }

  function fakeEvent<T extends Partial<Input>>(overrides: T): T & Input {
    return {
      id: 100,
      callId: 600,
      type: 'ANSWERED',
      date,
      download: null,
      downloadId: null,
      part: null,
      partId: null,
      rawRequest: null,
      ...overrides,
    };
  }
});

describe('responseForEvent', () => {
  const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
  const loggerMock = logger as unknown as DeepMockProxy<Logger>;

  beforeEach(() => {
    mockReset(prismaMock);
    mockReset(loggerMock);
  });

  describe('Answered', () => {
    it('Returns no-op', async () => {
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.ANSWERED })
      );

      expect(response).toStrictEqual<Output>({
        type: 'no-op',
      });
    });
  });

  describe('Fetching episode', () => {
    it('Returns introduction if no waiting', async () => {
      prismaMock.callEvent.count.mockResolvedValue(0);
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.FETCHING_EPISODE })
      );

      expect(response).toStrictEqual<Output>({
        type: 'introduction',
      });
    });

    it('Returns waiting if no waiting', async () => {
      prismaMock.callEvent.count.mockResolvedValue(1);
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.FETCHING_EPISODE })
      );

      expect(response).toStrictEqual<Output>({
        type: 'waiting',
        messageCount: 1,
      });
    });
  });

  describe('Episode ready', () => {
    it('Returns no-op', async () => {
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.EPISODE_READY })
      );

      expect(response).toStrictEqual<Output>({
        type: 'no-op',
      });
    });
  });

  describe('No episode', () => {
    it('Returns no episode', async () => {
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.NO_EPISODE })
      );

      expect(response).toStrictEqual<Output>({
        type: 'no-episode',
      });
    });
  });

  describe('Episode error', () => {
    it('Returns episode error', async () => {
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.EPISODE_ERROR })
      );

      expect(response).toStrictEqual<Output>({
        type: 'episode-error',
      });
    });
  });

  describe('Waiting message', () => {
    it('Returns waiting', async () => {
      prismaMock.callEvent.count.mockResolvedValue(10);
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ id: 730, callId: 549, type: CallEventType.WAITING_MESSAGE })
      );

      expect(response).toStrictEqual<Output>({
        type: 'waiting',
        messageCount: 10,
      });

      expect(prismaMock.callEvent.count).toHaveBeenCalledWith({
        where: {
          id: { not: 730 },
          call: { id: 549 },
          type: CallEventType.WAITING_MESSAGE,
        },
      });
    });
  });

  describe('Introducing episode', () => {
    it('Returns introduction', async () => {
      prismaMock.callEvent.count.mockResolvedValue(0);

      const response = await responseForEvent(
        prismaMock,
        fakeEvent({
          id: 642,
          callId: 309,
          type: CallEventType.INTRODUCING_EPISODE,
          download: fakeDownload({
            id: 563,
            episode: fakeEpisode({
              id: 832,
            }),
          }),
        })
      );

      expect(response).toStrictEqual<Output>({
        type: 'episode-introduction',
        playable: fakeDownload({
          id: 563,
          episode: fakeEpisode({ id: 832 }),
        }),
        waitingMessageCount: 0,
      });

      expect(prismaMock.callEvent.count).toHaveBeenCalledWith({
        where: {
          id: { not: 642 },
          call: { id: 309 },
          type: CallEventType.WAITING_MESSAGE,
        },
      });
    });

    it('Returns introduction with message count', async () => {
      prismaMock.callEvent.count.mockResolvedValue(4);
      const download = fakeDownload({
        id: 872,
        episode: fakeEpisode({
          id: 560,
        }),
      });

      const response = await responseForEvent(
        prismaMock,
        fakeEvent({
          id: 341,
          callId: 917,
          type: CallEventType.INTRODUCING_EPISODE,
          download,
        })
      );

      expect(response).toStrictEqual<Output>({
        type: 'episode-introduction',
        playable: download,
        waitingMessageCount: 4,
      });

      expect(prismaMock.callEvent.count).toHaveBeenCalledWith({
        where: {
          id: { not: 341 },
          call: { id: 917 },
          type: CallEventType.WAITING_MESSAGE,
        },
      });
    });

    it('Throws if no download', async () => {
      const event = fakeEvent({
        type: CallEventType.INTRODUCING_EPISODE,
        download: null,
      });

      await expect(responseForEvent(prismaMock, event)).rejects.toThrow(
        'Missing download for INTRODUCING_EPISODE event'
      );

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing download for INTRODUCING_EPISODE event',
        { event }
      );
    });
  });

  describe('Playing episode', () => {
    it('Returns play part', async () => {
      const download = fakeDownload({
        id: 872,
        episode: fakeEpisode({
          id: 560,
        }),
      });
      const part = fakePart({
        id: 358,
      });

      const response = await responseForEvent(
        prismaMock,
        fakeEvent({
          type: CallEventType.PLAYING_EPISODE,
          download: download,
          part: part,
        })
      );

      expect(response).toStrictEqual<Output>({
        type: 'episode-play-part',
        playable: download,
        part,
      });
    });

    it('Throws if no download', async () => {
      const event = fakeEvent({
        type: CallEventType.PLAYING_EPISODE,
        download: null,
      });

      await expect(responseForEvent(prismaMock, event)).rejects.toThrow(
        'Missing download for PLAYING_EPISODE event'
      );

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing download for PLAYING_EPISODE event',
        { event }
      );
    });

    it('Throws if no part', async () => {
      const event = fakeEvent({
        type: CallEventType.PLAYING_EPISODE,
        download: fakeDownload({
          id: 892,
          episode: fakeEpisode({
            id: 317,
          }),
        }),
        part: null,
      });

      await expect(responseForEvent(prismaMock, event)).rejects.toThrow(
        'Missing part for PLAYING_EPISODE event'
      );

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Missing part for PLAYING_EPISODE event',
        { event }
      );
    });
  });

  describe('Ending episode', () => {
    it('Returns outro', async () => {
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.ENDING_EPISODE })
      );

      expect(response).toStrictEqual<Output>({
        type: 'outro',
      });
    });
  });

  describe('Ended', () => {
    it('Returns hang up', async () => {
      const response = await responseForEvent(
        prismaMock,
        fakeEvent({ type: CallEventType.ENDED })
      );

      expect(response).toStrictEqual<Output>({
        type: 'hang-up',
      });
    });
  });

  //// Helpers

  type Input = Parameters<typeof responseForEvent>[1];
  type Output = Awaited<ReturnType<typeof responseForEvent>>;

  function fakeEpisode<T extends Partial<Episode>>(overrides: T): T & Episode {
    return {
      id: 400,
      podcastId: 200,
      guid: 'episode-guid',
      title: 'Episode title',
      contentURL: 'https://example.com',
      publishDate: date,
      imageURL: 'https://example.com/image.jpg',
      description: 'Episode description',
      ...overrides,
    };
  }

  function fakeDownload<T extends Partial<EpisodeDownload>>(
    overrides: T
  ): T & EpisodeDownload {
    return {
      id: 300,
      episodeId: 400,
      contentURL: 'https://example.com',
      downloadDate: date,
      downloadFinishDate: date,
      finished: true,
      deleted: false,
      ...overrides,
    };
  }

  function fakePart<T extends Partial<EpisodePart>>(
    overrides: T
  ): T & EpisodePart {
    return {
      id: 500,
      downloadId: 300,
      sortOrder: 4,
      key: 'part-4.mp3',
      url: 'https://example.com/part-4.mp3',
      size: 1024,
      duration: 10,
      ...overrides,
    };
  }

  function fakeEvent<T extends Partial<Input>>(overrides: T): T & Input {
    return {
      id: 100,
      callId: 600,
      type: 'ANSWERED',
      date,
      download: null,
      downloadId: null,
      part: null,
      partId: null,
      rawRequest: null,
      ...overrides,
    };
  }
});

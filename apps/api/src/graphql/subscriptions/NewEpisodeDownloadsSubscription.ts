import { PrismaClient } from '@prisma/client';
import { formatPrismaCursor } from '@pothos/plugin-prisma';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubEpisodeNewDownload, pubsub } from '../../pubsub';

export function addNewEpisodeDownloadsSubscriptionToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient,
  types: Types
) {
  const { Episode, EpisodeDownload } = types;

  const NewEpisodeDownloadsConnectionEdge =
    builder.objectRef<PubSubEpisodeNewDownload>(
      'NewEpisodeDownloadsConnectionEdge'
    );

  NewEpisodeDownloadsConnectionEdge.implement({
    fields: t => ({
      cursor: t.field({
        type: 'String',
        resolve: event =>
          formatPrismaCursor(event.episodeDownload, ['downloadDate', 'id']),
      }),
      node: t.prismaField({
        type: EpisodeDownload,
        resolve: (query, event) =>
          prisma.episodeDownload.findUniqueOrThrow({
            where: { id: event.episodeDownload.id },
            ...query,
          }),
      }),
    }),
  });

  const NewEpisodeDownloadsConnection =
    builder.objectRef<PubSubEpisodeNewDownload>(
      'NewEpisodeDownloadsConnection'
    );
  NewEpisodeDownloadsConnection.implement({
    fields: t => ({
      edges: t.field({
        type: [NewEpisodeDownloadsConnectionEdge],
        resolve: event => [event],
      }),
    }),
  });

  const NewEpisodeDownloadsSubscription =
    builder.objectRef<PubSubEpisodeNewDownload>(
      'NewEpisodeDownloadsSubscription'
    );
  NewEpisodeDownloadsSubscription.implement({
    fields: t => ({
      episode: t.prismaField({
        type: Episode,
        resolve: (query, event) =>
          prisma.episode.findUniqueOrThrow({
            where: { id: event.episode.id },
            ...query,
          }),
      }),
      newDownloads: t.field({
        type: NewEpisodeDownloadsConnection,
        resolve: event => event,
      }),
    }),
  });

  builder.subscriptionField('newEpisodeDownloads', t =>
    t.field({
      type: NewEpisodeDownloadsConnection,
      args: {
        episodeIdentifier: t.arg.int(),
      },
      subscribe: (_, args) => {
        if (args.episodeIdentifier) {
          return pubsub.subscribe('episodeNewDownload', args.episodeIdentifier);
        }
        // We don’t currently support global subscriptions

        // eslint-disable-next-line @typescript-eslint/no-empty-function, func-names
        return { [Symbol.asyncIterator]: () => (async function* () {})() };
      },
      resolve: event => event,
    })
  );
}

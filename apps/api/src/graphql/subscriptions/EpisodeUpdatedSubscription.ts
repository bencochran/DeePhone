import { PrismaClient } from '@prisma/client';
import { Repeater } from 'graphql-yoga';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubEpisodeUpdated, pubsub } from '../../pubsub';

export function addEpisodeUpdatedSubscriptionToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient,
  types: Types
) {
  const { Episode } = types;

  const EpisodeUpdatedSubscription = builder.objectRef<PubSubEpisodeUpdated>(
    'EpisodeUpdatedSubscription'
  );
  EpisodeUpdatedSubscription.implement({
    fields: t => ({
      episode: t.prismaField({
        type: Episode,
        resolve: (query, event) =>
          prisma.episode.findUniqueOrThrow({
            where: { id: event.episode.id },
            ...query,
          }),
      }),
    }),
  });

  builder.subscriptionField('episodeUpdated', t =>
    t.field({
      type: EpisodeUpdatedSubscription,
      args: {
        episodeIdentifier: t.arg.int({ required: true }),
      },
      subscribe: (_, args) => {
        const a = Repeater.merge([
          pubsub.subscribe('episodeNewCall', args.episodeIdentifier),
          pubsub.subscribe('episodeUpdated', args.episodeIdentifier),
        ]);
        return a;
      },
      resolve: event => event,
    })
  );

  return EpisodeUpdatedSubscription;
}

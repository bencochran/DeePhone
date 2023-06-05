import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubEpisodeDownloadUpdated, pubsub } from '../../pubsub';

export function addEpisodeDownloadUpdatedSubscriptionToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient,
  types: Types
) {
  const { EpisodeDownload } = types;

  const EpisodeDownloadUpdatedSubscription =
    builder.objectRef<PubSubEpisodeDownloadUpdated>(
      'EpisodeDownloadUpdatedSubscription'
    );
  EpisodeDownloadUpdatedSubscription.implement({
    fields: t => ({
      download: t.prismaField({
        type: EpisodeDownload,
        resolve: (query, event) =>
          prisma.episodeDownload.findUniqueOrThrow({
            where: { id: event.episodeDownload.id },
            ...query,
          }),
      }),
    }),
  });

  builder.subscriptionField('episodeDownloadUpdated', t =>
    t.field({
      type: EpisodeDownloadUpdatedSubscription,
      args: {
        episodeDownloadIdentifier: t.arg.int({ required: true }),
      },
      subscribe: (_, args) =>
        pubsub.subscribe(
          'episodeDownloadUpdated',
          args.episodeDownloadIdentifier
        ),
      resolve: event => event,
    })
  );

  return EpisodeDownloadUpdatedSubscription;
}

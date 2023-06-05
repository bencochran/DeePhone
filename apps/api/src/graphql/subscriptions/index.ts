import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { addCallUpdatedSubscriptionToBuilder } from './CallUpdatedSubscription';
import { addNewCallsSubscriptionToBuilder } from './NewCallsSubscription';
import { addEpisodeUpdatedSubscriptionToBuilder } from './EpisodeUpdatedSubscription';
import { addNewEpisodeDownloadsSubscriptionToBuilder } from './NewEpisodeDownloadsSubscription';
import { addEpisodeDownloadUpdatedSubscriptionToBuilder } from './EpisodeDownloadUpdatedSubscription';

export function addSubscriptionsToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient,
  types: Types
) {
  builder.subscriptionType({});
  addCallUpdatedSubscriptionToBuilder(builder, prisma, types);
  addNewCallsSubscriptionToBuilder(builder, prisma, types);
  addEpisodeUpdatedSubscriptionToBuilder(builder, prisma, types);
  addNewEpisodeDownloadsSubscriptionToBuilder(builder, prisma, types);
  addEpisodeDownloadUpdatedSubscriptionToBuilder(builder, prisma, types);
}

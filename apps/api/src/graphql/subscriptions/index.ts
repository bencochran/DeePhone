import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { addCallUpdatedSubscriptionToBuilder } from './CallUpdatedSubscription';
import { addNewCallsSubscriptionToBuilder } from './NewCallsSubscription';
import { addEpisodeUpdatedSubscriptionToBuilder } from './EpisodeUpdatedSubscription';

export function addSubscriptionsToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient, types: Types) {
  builder.subscriptionType({});
  addCallUpdatedSubscriptionToBuilder(builder, types);
  addNewCallsSubscriptionToBuilder(builder, types);
  addEpisodeUpdatedSubscriptionToBuilder(builder, prisma, types);
}

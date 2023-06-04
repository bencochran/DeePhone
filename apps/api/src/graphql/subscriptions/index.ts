import { buildBuilder } from '../builder';
import { Types } from '../types';
import { Connections } from '../connections';
import { addCallUpdatedSubscriptionToBuilder } from './CallUpdatedSubscription';
import { addNewCallsSubscriptionToBuilder } from './NewCallsSubscription';

export function addSubscriptionsToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types, connections: Connections) {
  builder.subscriptionType({});
  addCallUpdatedSubscriptionToBuilder(builder, types, connections);
  addNewCallsSubscriptionToBuilder(builder, types);
}

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { addCallUpdatedSubscriptionToBuilder } from './CallUpdatedSubscription';
import { addNewCallsSubscriptionToBuilder } from './NewCallsSubscription';

export function addSubscriptionsToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  builder.subscriptionType({});
  addCallUpdatedSubscriptionToBuilder(builder, types);
  addNewCallsSubscriptionToBuilder(builder, types);
}

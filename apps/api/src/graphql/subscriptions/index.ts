import { buildBuilder } from '../builder';
import { addCallUpdatedSubscriptionToBuilder } from './CallUpdatedSubscription';
import { Types } from '../types';
import { Connections } from '../connections';

export function addSubscriptionsToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types, connections: Connections) {
  addCallUpdatedSubscriptionToBuilder(builder, types, connections);
}

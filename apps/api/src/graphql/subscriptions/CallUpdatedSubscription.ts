import { prismaConnectionHelpers } from '@pothos/plugin-prisma';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubCallUpdated, pubsub } from '../../pubsub';
import { Connections } from '../connections';

export function addCallUpdatedSubscriptionToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types, connections: Connections) {
  const { Call, CallEvent } = types;
  const { CallEventsConnection } = connections;

  const callEventsConnectionHelpers = prismaConnectionHelpers(
    builder,
    'CallEvent',
    { cursor: 'date_id' },
  );

  const CallUpdatedSubscription = builder.objectRef<PubSubCallUpdated>('CallUpdatedSubscription');

  CallUpdatedSubscription.implement({
    fields: (t) => ({
      call: t.prismaField({
        type: Call,
        resolve: (query, event) => event.call,
      }),
      newEvents: t.connection(
        {
          type: CallEvent,
          resolve: (event, args, ctx) => {
            const resolved = callEventsConnectionHelpers.resolve(
              [event.event],
              args,
              ctx
            );
            return resolved;
          }
        },
        CallEventsConnection,
        {}
      ),
    })
  });

  builder.subscriptionField('callUpdated', (t) =>
    t.field({
      type: CallUpdatedSubscription,
      args: {
        callIdentifier: t.arg.int({ required: true }),
      },
      subscribe: (_, args) => pubsub.subscribe('callUpdated', args.callIdentifier),
      resolve: (event) => event,
    })
  );

  return CallUpdatedSubscription;
}

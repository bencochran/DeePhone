import { formatPrismaCursor } from '@pothos/plugin-prisma';
import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubCallUpdated, pubsub } from '../../pubsub';

export function addCallUpdatedSubscriptionToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient,
  types: Types
) {
  const { Call, CallEvent } = types;

  const CallUpdatedNewEventsConnectionEdge =
    builder.objectRef<PubSubCallUpdated>('CallUpdatedNewEventsConnectionEdge');
  CallUpdatedNewEventsConnectionEdge.implement({
    fields: t => ({
      cursor: t.field({
        type: 'String',
        resolve: event => formatPrismaCursor(event.event, ['date', 'id']),
      }),
      node: t.prismaField({
        type: CallEvent,

        resolve: (query, event) =>
          prisma.callEvent.findUniqueOrThrow({
            where: { id: event.event.id },
            ...query,
          }),
      }),
    }),
  });

  const CallUpdatedNewEventsConnection = builder.objectRef<PubSubCallUpdated>(
    'CallUpdatedNewEventsConnection'
  );
  CallUpdatedNewEventsConnection.implement({
    fields: t => ({
      edges: t.field({
        type: [CallUpdatedNewEventsConnectionEdge],
        resolve: event => [event],
      }),
    }),
  });

  const CallUpdatedSubscription = builder.objectRef<PubSubCallUpdated>(
    'CallUpdatedSubscription'
  );
  CallUpdatedSubscription.implement({
    fields: t => ({
      call: t.prismaField({
        type: Call,
        resolve: (query, event) =>
          prisma.call.findUniqueOrThrow({
            where: { id: event.call.id },
            ...query,
          }),
      }),
      newEvents: t.field({
        type: CallUpdatedNewEventsConnection,
        resolve: event => event,
      }),
    }),
  });

  builder.subscriptionField('callUpdated', t =>
    t.field({
      type: CallUpdatedSubscription,
      args: {
        callIdentifier: t.arg.int({ required: true }),
      },
      subscribe: (_, args) =>
        pubsub.subscribe('callUpdated', args.callIdentifier),
      resolve: event => event,
    })
  );

  return CallUpdatedSubscription;
}

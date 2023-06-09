import { PrismaClient } from '@prisma/client';
import { encodeGlobalID } from '@pothos/plugin-relay';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubNewCall, pubsub } from '../../pubsub';

export function addNewCallsSubscriptionToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient,
  types: Types
) {
  const { Call } = types;

  const NewCallsConnectionEdge = builder.objectRef<PubSubNewCall>(
    'NewCallsConnectionEdge'
  );
  NewCallsConnectionEdge.implement({
    fields: t => ({
      cursor: t.field({
        type: 'String',
        resolve: event => encodeGlobalID('Call', event.call.id),
      }),
      node: t.prismaField({
        type: Call,
        resolve: (query, event) =>
          prisma.call.findUniqueOrThrow({
            where: { id: event.call.id },
            ...query,
          }),
      }),
    }),
  });

  const NewCallsConnection =
    builder.objectRef<PubSubNewCall>('NewCallsConnection');
  NewCallsConnection.implement({
    fields: t => ({
      edges: t.field({
        type: [NewCallsConnectionEdge],
        resolve: event => [event],
      }),
    }),
  });

  builder.subscriptionField('newCalls', t =>
    t.field({
      type: NewCallsConnection,
      args: {
        episodeIdentifier: t.arg.int(),
      },
      subscribe: (_, args) => {
        if (args.episodeIdentifier) {
          return pubsub.subscribe('episodeNewCall', args.episodeIdentifier);
        }
        return pubsub.subscribe('newCall');
      },
      resolve: event => event,
    })
  );
}

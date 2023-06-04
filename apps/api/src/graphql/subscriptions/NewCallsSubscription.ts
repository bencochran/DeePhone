import { prismaConnectionHelpers } from '@pothos/plugin-prisma';
import { encodeGlobalID } from '@pothos/plugin-relay';

import { buildBuilder } from '../builder';
import { Types } from '../types';
import { PubSubNewCall, pubsub } from '../../pubsub';

export function addNewCallsSubscriptionToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  const { Call } = types;

  const callEventsConnectionHelpers = prismaConnectionHelpers(
    builder,
    'Call',
    { cursor: 'startDate_id' },
  );

  const NewCallsConnectionEdge = builder.objectRef<PubSubNewCall>('NewCallsConnectionEdge');
  NewCallsConnectionEdge.implement({
    fields: (t) => ({
      cursor: t.field({
        type: 'String',
        resolve: (event) => encodeGlobalID('Call', event.call.id),
      }),
      node: t.field({
        type: Call,
        resolve: (event) => event.call,
      }),
    }),
  });

  const NewCallsConnection = builder.objectRef<PubSubNewCall>('NewCallsConnection');
  NewCallsConnection.implement({
    fields: (t) => ({
      edges: t.field({
        type: [NewCallsConnectionEdge],
        resolve: (event) => [event],
      }),
    }),
  })

  builder.subscriptionField('newCalls', (t) =>
    t.field({
      type: NewCallsConnection,
      args: {
        episodeIdentifier: t.arg.int(),
      },
      subscribe: (_, args) => {
        if (args.episodeIdentifier) {
          // For now, we don't support subscribing to new calls for a specific episode.
          return { [Symbol.asyncIterator]: () => (async function* () { })() };
        } else {
          return pubsub.subscribe('newCall');
        }
      },
      resolve: (event, args, ctx) => event,
    })
  );
}

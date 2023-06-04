import { buildBuilder } from '../builder';
import { Types } from '../types';

export function addCallEventsConnectionToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  const { CallEvent } = types;
  const CallEventsConnection = builder.connectionObject(
    {
      type: CallEvent,
      name: 'CallEventsConnection',
    },
    {
      name: 'CallEventsConnectionEdge',
    }
  );

  builder.prismaObjectField('Call', 'events', (t) =>
    t.relatedConnection('events', {
      cursor: 'date_id',
      args: {
        oldestFirst: t.arg.boolean(),
      },
      query: (args) => ({
        orderBy: { date: args.oldestFirst ? 'asc' : 'desc' },
      }),
    }, CallEventsConnection)
  );

  return CallEventsConnection;
}

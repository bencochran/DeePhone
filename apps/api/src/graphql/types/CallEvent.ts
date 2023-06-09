import { CallEventType } from '@prisma/client';

import { buildBuilder } from '../builder';

export function addCallEventToBuilder(
  builder: ReturnType<typeof buildBuilder>
) {
  builder.enumType(CallEventType, {
    name: 'CallEventType',
  });

  return builder.prismaNode('CallEvent', {
    id: { field: 'id' },
    fields: t => ({
      date: t.expose('date', {
        type: 'DateTime',
      }),
      type: t.field({
        type: CallEventType,
        resolve: event => event.type,
      }),
      download: t.relation('download', { nullable: true }),
      part: t.relation('part', { nullable: true }),
    }),
  });
}

import { PrismaClient, CallState } from '@prisma/client';

import { buildBuilder } from '../builder';

export function addCallEventToBuilder(builder: ReturnType<typeof buildBuilder>, _prisma: PrismaClient) {
  builder.prismaObject('CallEvent', {
    fields: (t) => ({
      id: t.exposeID('id'),
      date: t.expose('date', {
        type: 'DateTime',
      }),
      state: t.field({
        type: CallState,
        resolve: (event) => event.state,
      }),
      download: t.relation('download', { nullable: true }),
      part: t.relation('currentPart', { nullable: true }),
    })
  });

  builder.enumType(CallState, {
    name: 'CallState',
  });
}

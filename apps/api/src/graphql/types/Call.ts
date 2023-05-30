import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';

export function addCallToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient) {
  builder.prismaObject('Call', {
    fields: (t) => ({
      id: t.exposeID('id'),
      phoneNumber: t.exposeString('phoneNumber'),
      startDate: t.expose('startDate', {
        type: 'DateTime',
      }),
      endDate: t.expose('endDate', {
        type: 'DateTime',
        nullable: true,
      }),
      callerName: t.exposeString('callerName', { nullable: true }),
      callerCity: t.exposeString('callerCity', { nullable: true }),
      callerState: t.exposeString('callerState', { nullable: true }),
      callerZip: t.exposeString('callerZip', { nullable: true }),
      callerCountry: t.exposeString('callerCountry', { nullable: true }),
      duration: t.exposeInt('callDuration', { nullable: true }),
      events: t.relatedConnection('events', {
        cursor: 'date_id',
        query: { orderBy: { date: 'desc' } },
      })
    })
  });

  builder.queryFields((t) => ({
    call: t.prismaField({
      type: 'Call',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.call.findUnique({
          ...query,
          where: { id: Number.parseInt(String(args.id), 10) },
        })
    }),
    calls: t.prismaConnection({
      type: 'Call',
      cursor: 'startDate_id',
      args: {
        onlyInProgress: t.arg.boolean(),
        onlyComplete: t.arg.boolean(),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.call.findMany({
          ...query,
          where: { AND: [
            args.onlyInProgress ? { endDate: null } : { },
            args.onlyComplete ? { NOT: { endDate: null } } : { },
          ] },
          orderBy: { startDate: 'desc' }
        })
    }),
  }));
}

import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';

function maskPhoneNumber(phoneNumber: string) {
  const match = phoneNumber.match(/^(.*)(\d{4})$/);
  if (!match) {
    // Couldn’t find last 4, just obscure the whole thing
    return phoneNumber.replaceAll(/\d/g, 'X');
  }
  const [_, toMask, toShow] = match;
  return toMask.replaceAll(/\d/g, 'X') + toShow;
}

export function addCallToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient) {
  builder.prismaObject('Call', {
    fields: (t) => ({
      id: t.exposeID('id'),
      phoneNumber: t.string({
        resolve: (call) => maskPhoneNumber(call.phoneNumber),
      }),
      startDate: t.expose('startDate', {
        type: 'DateTime',
      }),
      endDate: t.expose('endDate', {
        type: 'DateTime',
        nullable: true,
      }),
      callerCountry: t.exposeString('callerCountry', { nullable: true }),
      duration: t.exposeInt('callDuration', { nullable: true }),
      events: t.relatedConnection('events', {
        cursor: 'date_id',
        query: { orderBy: { date: 'desc' } },
      }),

      // TODO: Re-expose these once we have authz
      callerName: t.string({
        nullable: true,
        resolve: () => null,
      }),
      callerCity: t.string({
        nullable: true,
        resolve: () => null,
      }),
      callerState: t.string({
        nullable: true,
        resolve: () => null,
      }),
      callerZip: t.string({
        nullable: true,
        resolve: () => null,
      }),
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

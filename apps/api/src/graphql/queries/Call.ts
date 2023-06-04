import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';
import { Types } from '../types';

export function addCallQueriesToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient, types: Types) {
  const { Call } = types;

  builder.queryFields((t) => ({
    call: t.prismaField({
      type: Call,
      nullable: true,
      args: {
        identifier: t.arg.int({ required: true }),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.call.findUnique({
          ...query,
          where: { id: args.identifier },
        })
    }),
    calls: t.prismaConnection({
      type: 'Call',
      cursor: 'startDate_id',
      args: {
        onlyInProgress: t.arg.boolean(),
        onlyComplete: t.arg.boolean(),
        episodeIdentifier: t.arg.int(),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.call.findMany({
          ...query,
          where: {
            AND: [
              args.episodeIdentifier ? { events: { some: { download: { episode: { id: args.episodeIdentifier } } } } } : {},
              args.onlyInProgress ? { endDate: null } : {},
              args.onlyComplete ? { NOT: { endDate: null } } : {},
            ]
          },
          orderBy: { startDate: 'desc' }
        })
    }),
  }));
}

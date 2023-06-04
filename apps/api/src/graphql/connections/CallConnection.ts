import { prismaConnectionHelpers } from '@pothos/plugin-prisma';

import { buildBuilder } from '../builder';
import { Types } from '../types';

export function addCallConnectionToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  const { Call } = types;

  const downloadCallConnectionHelpers = prismaConnectionHelpers(
    builder,
    'CallEvent',
    {
      cursor: 'date_id',
      select: (nodeSelection) => ({
        call: nodeSelection({
        }),
      }),
      resolveNode: (callEvent) => callEvent.call,
    },
  );

  builder.prismaObjectField('EpisodeDownload', 'calls', (t) =>
    t.connection({
      type: Call,
      select: (args, ctx, nestedSelection) => ({
        callEvents: {
          ...downloadCallConnectionHelpers.getQuery(args, ctx, nestedSelection),
          where: { type: 'INTRODUCING_EPISODE' },
          orderBy: { date: 'desc' },
        },
      }),
      resolve: (download, args, ctx) => downloadCallConnectionHelpers.resolve(
        download.callEvents,
        args,
        ctx
      ),
    })
  );
}

import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';

export function addEpisodeQueriesToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient
) {
  builder.queryFields(t => ({
    episode: t.prismaField({
      type: 'Episode',
      nullable: true,
      args: {
        identifier: t.arg.int({ required: true }),
      },
      resolve: (query, _parent, args) =>
        prisma.episode.findUnique({
          ...query,
          where: { id: args.identifier },
        }),
    }),
    episodes: t.prismaConnection({
      type: 'Episode',
      cursor: 'publishDate_id',
      resolve: query =>
        prisma.episode.findMany({ ...query, orderBy: { publishDate: 'desc' } }),
    }),
  }));
}

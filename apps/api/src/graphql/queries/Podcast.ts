import { PrismaClient } from '@prisma/client';
import { buildBuilder } from '../builder';

export function addPodcastQueriesToBuilder(
  builder: ReturnType<typeof buildBuilder>,
  prisma: PrismaClient
) {
  builder.queryFields(t => ({
    podcast: t.prismaField({
      type: 'Podcast',
      nullable: true,
      args: {
        identifier: t.arg.int({ required: true }),
      },
      resolve: (query, _parent, args) =>
        prisma.podcast.findUnique({
          ...query,
          where: { id: args.identifier },
        }),
    }),
    podcasts: t.prismaConnection({
      type: 'Podcast',
      cursor: 'title_id',
      resolve: query =>
        prisma.podcast.findMany({ ...query, orderBy: { title: 'asc' } }),
    }),
  }));
}

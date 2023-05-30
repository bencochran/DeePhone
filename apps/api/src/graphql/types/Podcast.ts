import { PrismaClient } from '@prisma/client';
import { buildBuilder } from '../builder';

export function addPodcastToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient) {
  builder.prismaObject('Podcast', {
    fields: (t) => ({
      id: t.exposeID('id'),
      title: t.exposeString('title'),
      feedURL: t.expose('feedURL', {
        type: 'URL',
      }),
      imageURL: t.expose('imageURL', {
        type: 'URL',
        nullable: true,
      }),
      lastFetchDate: t.expose('lastFetchDate', {
        type: 'DateTime',
        nullable: true,
      }),
      episodes: t.relatedConnection('episodes', {
        cursor: 'publishDate_id',
        args: {
          oldestFirst: t.arg.boolean(),
        },
        query: (args) => ({
          orderBy: { publishDate: args.oldestFirst ? 'asc' : 'desc' },
        })
      }),
    })
  });

  builder.queryFields((t) => ({
    podcast: t.prismaField({
      type: 'Podcast',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.podcast.findUnique({
          ...query,
          where: { id: Number.parseInt(String(args.id), 10) },
        }),
    }),
    podcasts: t.prismaConnection({
      type: 'Podcast',
      cursor: 'title_id',
      resolve: (query, _parent, _args, _ctx, _info) =>
        prisma.podcast.findMany({ ...query, orderBy: { title: 'asc' } }),
    }),
  }));
}

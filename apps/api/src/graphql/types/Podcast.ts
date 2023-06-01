import { PrismaClient } from '@prisma/client';
import { buildBuilder } from '../builder';

export function addPodcastToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient) {
  builder.prismaNode('Podcast', {
    id: { field: 'id' },
    fields: (t) => ({
      identifier: t.exposeInt('id'),
      title: t.exposeString('title'),
      feedURL: t.expose('feedURL', {
        type: 'URL',
      }),
      imageURL: t.expose('imageURL', {
        type: 'URL',
        nullable: true,
      }),
      description: t.exposeString('description', { nullable: true }),
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
        identifier: t.arg.int({ required: true }),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.podcast.findUnique({
          ...query,
          where: { id: args.identifier },
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

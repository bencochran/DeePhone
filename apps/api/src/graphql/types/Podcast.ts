import { buildBuilder } from '../builder';

export function addPodcastToBuilder(builder: ReturnType<typeof buildBuilder>) {
  return builder.prismaNode('Podcast', {
    id: { field: 'id' },
    fields: t => ({
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
        query: args => ({
          orderBy: { publishDate: args.oldestFirst ? 'asc' : 'desc' },
        }),
      }),
      callCount: t.int({
        select: {
          episodes: {
            select: {
              downloads: {
                select: {
                  _count: {
                    select: {
                      callEvents: {
                        where: { type: 'INTRODUCING_EPISODE' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        resolve: episode =>
          episode.episodes.reduce(
            (sum, e) =>
              sum +
              e.downloads.reduce(
                (isum, dl) => isum + dl._count.callEvents,
                0 as number
              ),
            0 as number
          ),
      }),
    }),
  });
}

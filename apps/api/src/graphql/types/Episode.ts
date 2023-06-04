import { buildBuilder } from '../builder';

export function addEpisodeToBuilder(builder: ReturnType<typeof buildBuilder>) {
  return builder.prismaNode('Episode', {
    id: { field: 'id' },
    fields: (t) => ({
      identifier: t.exposeInt('id'),
      guid: t.exposeString('guid'),
      title: t.exposeString('title'),
      contentURL: t.expose('contentURL', {
        type: 'URL',
      }),
      publishDate: t.expose('publishDate', {
        type: 'DateTime',
      }),
      imageURL: t.expose('imageURL', {
        type: 'URL',
        nullable: true,
      }),
      description: t.exposeString('description', { nullable: true }),
      podcast: t.relation('podcast'),
      downloads: t.relatedConnection('downloads', {
        cursor: 'downloadDate_id',
        args: {
          excludeDeleted: t.arg.boolean(),
          onlyFinished: t.arg.boolean(),
          oldestFirst: t.arg.boolean(),
        },
        query: (args) => ({
          where: { AND: [
            args.excludeDeleted === true ? { deleted: false } : {},
            args.onlyFinished === true ? { finished: true } : {},
          ] },
          orderBy: { downloadDate: args.oldestFirst ? 'asc' : 'desc' },
        })
      }),
      callCount: t.int({
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
        resolve: (episode) => episode.downloads.reduce((sum, dl) => sum + dl._count.callEvents, 0 as number),
      }),
    })
  });
}

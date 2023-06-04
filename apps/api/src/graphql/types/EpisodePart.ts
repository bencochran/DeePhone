import { buildBuilder } from '../builder';

export function addEpisodePartToBuilder(builder: ReturnType<typeof buildBuilder>) {
  return builder.prismaNode('EpisodePart', {
    id: { field: 'id' },
    fields: (t) => ({
      download: t.relation('download'),
      url: t.expose('url', {
        type: 'URL',
      }),
      size: t.exposeInt('size'),
      duration: t.exposeFloat('duration'),
      number: t.field({
        type: 'Int',
        resolve: (event) => event.sortOrder + 1,
      })
    }),
  });
}

import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';

export function addEpisodePartToBuilder(builder: ReturnType<typeof buildBuilder>, _prisma: PrismaClient) {
  builder.prismaObject('EpisodePart', {
    fields: (t) => ({
      id: t.exposeID('id'),
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
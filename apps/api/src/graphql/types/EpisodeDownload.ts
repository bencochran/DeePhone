import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';

export function addEpisodeDownloadToBuilder(builder: ReturnType<typeof buildBuilder>, _prisma: PrismaClient) {
  builder.prismaNode('EpisodeDownload', {
    id: { field: 'id' },
    fields: (t) => ({
      contentURL: t.expose('contentURL', {
        type: 'URL',
      }),
      downloadDate: t.expose('downloadDate', {
        type: 'DateTime',
      }),
      downloadFinishDate: t.expose('downloadFinishDate', {
        type: 'DateTime',
        nullable: true,
      }),
      finished: t.exposeBoolean('finished'),
      deleted: t.exposeBoolean('deleted'),
      episode: t.relation('episode'),
      parts: t.relatedConnection('parts', {
        cursor: 'sortOrder_downloadId',
        query: {
          orderBy: { sortOrder: 'asc' },
        }
      }),
      partCount: t.relationCount('parts'),
      callCount: t.int({
        select: {
          _count: {
            select: {
              callEvents: {
                where: { type: 'INTRODUCING_EPISODE' },
              },
            },
          },
        },
        resolve: (download) => download._count.callEvents,
      }),
    })
  });
}

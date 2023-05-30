import { PrismaClient } from '@prisma/client';

import { buildBuilder } from './builder';
import { addPodcastToBuilder } from './types/Podcast';
import { addEpisodeToBuilder } from './types/Episode';
import { addEpisodeDownloadToBuilder } from './types/EpisodeDownload';
import { addEpisodePartToBuilder } from './types/EpisodePart';
import { addCallToBuilder } from './types/Call';
import { addCallEventToBuilder } from './types/CallEvent';

export function buildSchema(prisma: PrismaClient) {
  const builder = buildBuilder(prisma);
  addPodcastToBuilder(builder, prisma);
  addEpisodeToBuilder(builder, prisma);
  addEpisodeDownloadToBuilder(builder, prisma);
  addEpisodePartToBuilder(builder, prisma);
  addCallToBuilder(builder, prisma);
  addCallEventToBuilder(builder, prisma);
  return builder.toSchema();
}

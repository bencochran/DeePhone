import { PrismaClient } from '@prisma/client';

import { buildBuilder } from '../builder';
import { addPodcastQueriesToBuilder } from './Podcast';
import { addEpisodeQueriesToBuilder } from './Episode';
import { addCallQueriesToBuilder } from './Call';
import { Types } from '../types';

export function addQueriesToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient, types: Types) {
  addPodcastQueriesToBuilder(builder, prisma);
  addEpisodeQueriesToBuilder(builder, prisma);
  addCallQueriesToBuilder(builder, prisma, types);
}

import { PrismaClient } from '@prisma/client';

import { buildBuilder } from './builder';
import { addTypesToBuilder } from './types';
import { addQueriesToBuilder } from './queries';
import { addConnectionsToBuilder } from './connections';

export function buildSchema(prisma: PrismaClient) {
  const builder = buildBuilder(prisma);
  const nodeTypes = addTypesToBuilder(builder);
  addQueriesToBuilder(builder, prisma, nodeTypes);
  addConnectionsToBuilder(builder, nodeTypes);
  return builder.toSchema();
}

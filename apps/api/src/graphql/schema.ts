import { PrismaClient } from '@prisma/client';

import { buildBuilder } from './builder';
import { addTypesToBuilder } from './types';
import { addQueriesToBuilder } from './queries';
import { addConnectionsToBuilder } from './connections';
import { addSubscriptionsToBuilder } from './subscriptions';

export function buildSchema(prisma: PrismaClient) {
  const builder = buildBuilder(prisma);
  const nodeTypes = addTypesToBuilder(builder);
  addQueriesToBuilder(builder, prisma, nodeTypes);
  const connections = addConnectionsToBuilder(builder, nodeTypes);
  addSubscriptionsToBuilder(builder, nodeTypes, connections);
  return builder.toSchema();
}

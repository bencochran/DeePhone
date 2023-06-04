import { PrismaClient } from '@prisma/client';

import { buildBuilder } from './builder';
import { addTypesToBuilder } from './types';
import { addQueriesToBuilder } from './queries';
import { addConnectionsToBuilder } from './connections';
import { addSubscriptionsToBuilder } from './subscriptions';

export function buildSchema(prisma: PrismaClient) {
  const builder = buildBuilder(prisma);
  const types = addTypesToBuilder(builder);
  addQueriesToBuilder(builder, prisma, types);
  const connections = addConnectionsToBuilder(builder, types);
  addSubscriptionsToBuilder(builder, types, connections);
  return builder.toSchema();
}

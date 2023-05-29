import { Router } from 'express';
import { createYoga } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client';

import { buildSchema } from './schema';

export function buildRouter(prisma: PrismaClient, graphqlEndpoint: string) {
  const yoga = createYoga({
    schema: buildSchema(prisma),
    graphqlEndpoint,
  });

  const router = Router();
  router.use('/', yoga);
  return router;
}

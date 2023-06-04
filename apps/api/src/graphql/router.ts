import { Server } from 'http';
import { Router } from 'express';
import { createYoga } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Socket } from 'node:net';

import { buildSchema } from './schema';

export function buildRouter(prisma: PrismaClient, graphqlEndpoint: string, server: Server, wsServer: WebSocketServer) {
  const schema = buildSchema(prisma);

  useServer({
    execute: (args: any) => args.execute(args),
    subscribe: (args: any) => args.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        })

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        execute,
        subscribe,
      }

      const errors = validate(args.schema, args.document)
      if (errors.length) return errors
      return args
    },
  }, wsServer);

  const yoga = createYoga({
    graphiql: {
      subscriptionsProtocol: 'WS',
    },
    schema,
    graphqlEndpoint,
  });

  const router = Router();
  router.use('/', yoga);
  return router;
}

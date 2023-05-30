import 'dotenv/config'

import express from 'express';
import http from 'http';
import path from 'path';
import { PrismaClient, Podcast } from '@prisma/client';

import logger from './logger';
import { buildRouter as buildVoiceRouter } from './voice-router';
import { buildRouter as buildGraphQLRouter } from './graphql/router';

interface Boostrap {
  prisma: PrismaClient;
  podcast: Podcast;
}

async function bootstrap(): Promise<Boostrap> {
  const prisma = new PrismaClient();
  const count = await prisma.podcast.count();
  if (count === 0) {
    const podcast = await prisma.podcast.create({
      data: {
        title: 'TED Radio Hour',
        feedURL: 'https://feeds.npr.org/510298/podcast.xml',
      },
    });
    logger.info(`Created podcast`, { podcast });
    return { prisma, podcast };
  } else {
    const podcast = await prisma.podcast.findFirstOrThrow();
    if (count > 1) {
      logger.error(`Multiple podcasts found in database"`, { podcast });
    }
    logger.info(`Using podcast "${podcast.title}"`, { podcast });
    return { prisma, podcast };
  }
}

bootstrap()
  .then(({ prisma, podcast }) => {
    const app = express();
    app.enable('trust proxy');

    app.use('/', buildVoiceRouter(prisma, podcast));
    app.use('/api/graphql', buildGraphQLRouter(prisma, '/api/graphql'));

    // Serve static files as-is
    app.use(express.static(path.resolve('../web/dist')));

    // All other routes send the SPA root to let it do routing
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('../web/dist/index.html'));
    });

    const port = process.env.PORT || 5000;

    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
      logger.info(`HTTP server running on port ${port}!`);
    });
  });

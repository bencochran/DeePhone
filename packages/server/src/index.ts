import 'dotenv/config'

import express from 'express';
import http from 'http';
import { PrismaClient, Podcast } from '@prisma/client';

import logger from './logger.js';
import { buildRouter } from './voice-router.js';

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

    app.use('/', buildRouter(prisma, podcast));

    const port = process.env.PORT || 5000;

    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
      logger.info(`HTTP server running on port ${port}!`);
    });
  });

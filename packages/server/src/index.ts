import 'dotenv/config'

import express from 'express';
import http from 'http';

import logger from './logger.js';
import { buildRouter } from './voice-router.js';

const app = express();
app.enable('trust proxy');
app.use(buildRouter());

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  logger.info(`HTTP server running on port ${port}!`);
});

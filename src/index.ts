import 'dotenv/config'

import express from 'express';
import http from 'http';
import { twiml } from 'twilio';
import { createLogger, transports, format, config } from 'winston';

const logger = createLogger({
  levels: config.syslog.levels,
  transports: [new transports.Console()],
  level: process.env.LOGGER_LEVEL ?? 'info',
  format: process.env.LOGGER_FORMAT === 'human'
    ? format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    : format.json(),
});

const app = express();
app.enable('trust proxy');

app.post('/voice', (_req, res) => {
  const voiceResponse = new twiml.VoiceResponse();
  voiceResponse.say({ voice: 'alice' }, 'Hello, here is a response');
  // voiceResponse.play(url);
  res.type('text/xml');
  res.send(voiceResponse.toString());
});

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  logger.info(`HTTP server running on port ${port}!`);
})

import 'dotenv/config'

import express from 'express';
import http from 'http';
import { twiml } from 'twilio';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import path from 'path';

import logger from './logger';
import { fetchLatestEpisode, chopEpisode } from './podcast';

const app = express();
app.enable('trust proxy');

app.post('/voice', async (_req, res) => {
  const voiceResponse = new twiml.VoiceResponse();

  try {
    const latestEpisode = await fetchLatestEpisode();
    if (latestEpisode) {
      const today = utcToZonedTime(new Date(), 'America/New_York');
      const latest = utcToZonedTime(latestEpisode.date, 'America/New_York');
      const formattedToday = dateFormat(today, 'eeee, MMMM do');
      const formattedLatest = dateFormat(latest, 'eeee, MMMM do');
      const formattedAgo = formatDistance(latest, today, { addSuffix: true });

      const parts = await chopEpisode(latestEpisode);
      voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. Today is ${formattedToday}. Here is the latest Ted Radio Hour from ${formattedLatest} (${formattedAgo}).`);
      parts.forEach((part) => {
        voiceResponse.play(`/media/${latestEpisode.guid}/${part.filename}`);
      });
    } else {
      logger.warning('Unable to find latest episode');
      voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. I was unable to find the latest Ted Radio Hour. Please call again later.`);
    }
  } catch (error) {
    logger.error('Unable to fetch latest episode', { error });
    voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. Unfortunately there was a problem loading the latest Ted Radio Hour. Please call again later.`);
  }
  res.type('text/xml');
  res.send(voiceResponse.toString());
});

// Then downloaded files
app.use(express.static(path.resolve('downloads')));

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  logger.info(`HTTP server running on port ${port}!`);
});

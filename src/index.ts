import 'dotenv/config'

import express from 'express';
import http from 'http';
import { twiml } from 'twilio';
import Parser from 'rss-parser';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import logger from './logger';

interface Feed {}

interface Item {
  bar: number;
  enclosure: { url: string };
}

interface Episode {
  title: string;
  date: Date;
  url: string;
}

async function fetchLatestEpisode(): Promise<Episode | null> {
  const parser: Parser<Feed, Item> = new Parser();
  const feed = await parser.parseURL('https://feeds.npr.org/510298/podcast.xml');

  const episodes: Episode[] = feed.items.flatMap((item) => {
    if (!item.pubDate || !item.title || !item.enclosure || !item.enclosure.url) {
      return [];
    }
    const date = new Date(item.pubDate);
    if (Number.isNaN(date.getTime())) {
      return [];
    }
    return [{ title: item.title, date, url: item.enclosure.url }];
  });
  episodes.sort((lhs, rhs) => rhs.date.getTime() - lhs.date.getTime());

  if (episodes.length === 0) {
    return null;
  }
  return episodes[0];
}

const app = express();
app.enable('trust proxy');

app.post('/voice', async (_req, res) => {
  const voiceResponse = new twiml.VoiceResponse();

  const latestEpisode = await fetchLatestEpisode();
  if (latestEpisode) {
    const today = utcToZonedTime(new Date(), 'America/New_York');
    const latest = utcToZonedTime(latestEpisode.date, 'America/New_York');
    const formattedToday = dateFormat(today, 'eeee, MMMM do');
    const formattedLatest = dateFormat(latest, 'eeee, MMMM do');
    const formattedAgo = formatDistance(latest, today, { addSuffix: true });
    voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. Today is ${formattedToday}. Here is the latest Ted Radio Hour from ${formattedLatest} (${formattedAgo}). It may take a moment to begin playing.`);

    // TODO: Per Twilio: <Play>ing a file that is longer than 40 minutes can
    // result in a dropped call. If you need to <Play> a file longer than 40
    // minutes, consider splitting it up into smaller chunks.
    voiceResponse.play(latestEpisode.url);
  } else {
    voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. I was unable to find the latest Ted Radio Hour. Please call again later.`);
  }
  res.type('text/xml');
  res.send(voiceResponse.toString());
});

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  logger.info(`HTTP server running on port ${port}!`);
});

import 'dotenv/config'

import express from 'express';
import http from 'http';
import { twiml } from 'twilio';
import Parser from 'rss-parser';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import fs from 'fs';
import path from 'path';

import logger from './logger';
import download from './download';

interface Feed {}

interface Item {
  bar: number;
  enclosure: { url: string };
}

interface Episode {
  guid: string;
  title: string;
  date: Date;
  url: string;
}

interface DownloadedEpisode extends Episode {
  filename: string;
}

const MIN_EPISODE_FILE_SIZE_MB = 2;

async function downloadEpisode(episode: Episode): Promise<DownloadedEpisode> {
  const filename = `${episode.guid}.mp3`;
  if (!fs.existsSync('downloads/media')) {
    await fs.promises.mkdir('downloads/media', { recursive: true });
  }
  const destination = path.resolve('downloads/media', filename);
  if (fs.existsSync(destination)) {
    logger.info(`Episode "${episode.title}" already exists as "${filename}"`, { episode, filename });
    return { ...episode, filename }
  }

  logger.info(`Downloading episode "${episode.title}" as "${filename}"`, { episode, filename });
  await download(episode.url, destination);
  logger.info(`Finished downloading episode "${episode.title}" as "${filename}"`, { episode, filename });
  const { size } = await fs.promises.stat(destination);
  const sizeMegabytes = size / 1024 / 1024;
  if (sizeMegabytes < MIN_EPISODE_FILE_SIZE_MB) {
    fs.unlink(destination, () => {});
    logger.warning(`File "${destination}" is smaller than ${MIN_EPISODE_FILE_SIZE_MB}MB (${sizeMegabytes.toFixed(2)}MB). Considering this a download failure.`, { episode, filename, size });
    throw new Error(`File "${destination}" is smaller than ${MIN_EPISODE_FILE_SIZE_MB}MB (${sizeMegabytes.toFixed(2)}MB). Considering this a download failure.`);
  }
  return { ...episode, filename };
}

async function fetchLatestEpisode(): Promise<DownloadedEpisode | null> {
  const parser: Parser<Feed, Item> = new Parser();
  const feed = await parser.parseURL('https://feeds.npr.org/510298/podcast.xml');

  const episodes: Episode[] = feed.items.flatMap(({ title, guid, pubDate, enclosure }) => {
    if (!pubDate || !title || !enclosure || !enclosure.url || !guid) {
      return [];
    }

    const date = new Date(pubDate);
    if (Number.isNaN(date.getTime())) {
      return [];
    }
    return [{ guid, title, date, url: enclosure.url }];
  });
  episodes.sort((lhs, rhs) => rhs.date.getTime() - lhs.date.getTime());

  if (episodes.length === 0) {
    return null;
  }
  const [latest] = episodes;
  const downloaded = await downloadEpisode(latest);
  return downloaded;
}

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
      voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. Today is ${formattedToday}. Here is the latest Ted Radio Hour from ${formattedLatest} (${formattedAgo}). It may take a moment to begin playing.`);

      // TODO: Per Twilio: <Play>ing a file that is longer than 40 minutes can
      // result in a dropped call. If you need to <Play> a file longer than 40
      // minutes, consider splitting it up into smaller chunks.
      // voiceResponse.play(latestEpisode.url);
      voiceResponse.play(`/media/${latestEpisode.filename}`);
    } else {
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

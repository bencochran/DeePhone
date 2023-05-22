import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import { spawn } from 'child_process';

import logger from './logger.js';
import download from './download.js';

const MIN_EPISODE_FILE_SIZE_MB = 2;
const MIN_SILENCE_SPLIT_DURATION = 0.75

export interface Feed {}

export interface Item {
  bar: number;
  enclosure: { url: string };
}

export interface Episode {
  guid: string;
  title: string;
  date: Date;
  url: string;
}

export interface DownloadedEpisode extends Episode {
  filename: string;
}

export interface Part {
  filename: string;
}

export async function downloadEpisode(episode: Episode): Promise<DownloadedEpisode> {
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

export async function fetchLatestEpisode(): Promise<DownloadedEpisode | null> {
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
  return await downloadEpisode(latest);
}

export async function chopEpisode(episode: DownloadedEpisode): Promise<Part[]> {
  const inputFile = path.resolve('downloads/media', episode.filename);
  const desinationDir = path.resolve('downloads/media', episode.guid);
  const desinationFile = path.resolve(desinationDir, '%03d.mp3');

  if (fs.existsSync(desinationDir)) {
    const files = await fs.promises.readdir(desinationDir);
    if (files.length > 0) {
      return files.map(f => ({ filename: f }));
    }
  } else {
    await fs.promises.mkdir(desinationDir, { recursive: true });
  }

  // Detect periods of silence

  const silencedetectArgs = [
    '-i', inputFile,
    '-filter_complex', `[0:a]silencedetect=n=-30dB:d=${MIN_SILENCE_SPLIT_DURATION}[outa]`,
    '-map', '[outa]',
    '-f', 's16le',
    '-y', '/dev/null',
  ];

  const output = await new Promise<string>((resolve, reject) => {
    const proc = spawn('ffmpeg', silencedetectArgs);
    let result = '';
    proc.stdout?.on('data', (data) => {
      result += data.toString();
    });
    proc.stderr?.on('data', (data) => {
      result += data.toString();
    });
    proc.once('error', (error) => {
      reject(error);
    });
    proc.once('close', () => {
      resolve(result);
    });
  });

  const startTimes: string[] = [];
  const startMatches = output.matchAll(/silence_start: ([\d\.]+)/g);
  for (const match of startMatches) {
    startTimes.push(match[1]);
  }

  // Split on those periods of silence

  const segmentArgs = [
    '-i', inputFile,
    '-f', 'segment',
    '-segment_times', startTimes.join(','),
    '-reset_timestamps', '1',
    '-map', '0:a',
    '-c:a', 'copy',
    desinationFile,
  ];

  await new Promise<void>((resolve, reject) => {
    const proc = spawn('ffmpeg', segmentArgs, { stdio: ['ignore', process.stdout, process.stderr ]});
    proc.once('error', (error) => {
      // Make sure we delete any broken files
      fs.promises.rm(desinationDir, { recursive: true, force: true });

      reject(error);
    });
    proc.once('close', () => {
      resolve();
    });
  });

  const files = await fs.promises.readdir(desinationDir);
  return files.map(f => ({ filename: f }));
}

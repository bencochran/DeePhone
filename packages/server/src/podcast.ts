import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import { spawn } from 'child_process';
import { S3Client, PutObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { PrismaClient, Podcast, Episode } from '@prisma/client';

import logger from './logger.js';
import download from './download.js';

const MIN_EPISODE_FILE_SIZE_MB = 2;
const MIN_SILENCE_SPLIT_DURATION = 0.75

export interface Feed {}

export interface Item {
  bar: number;
  enclosure: { url: string };
}

export interface DownloadedEpisode extends Episode {
  filename: string;
}

export interface Part {
  filename: string;
  filePath: string;
}

export interface UploadedPart extends Part {
  url: string;
  key: string;
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
  await download(episode.contentURL, destination);
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

export async function fetchEpisodes(prisma: PrismaClient, podcast: Podcast): Promise<Episode[]> {
  const parser: Parser<Feed, Item> = new Parser();
  const feed = await parser.parseURL(podcast.feedURL);

  await Promise.all(feed.items.map(async ({ title, guid, pubDate, enclosure }) => {
    if (!pubDate || !title || !enclosure || !enclosure.url || !guid) {
      return null;
    }
    const publishDate = new Date(pubDate);
    if (Number.isNaN(publishDate.getTime())) {
      logger.warning(`Got invalid publish date "${pubDate}"`, {
        podcast,
        episode: { title, guid, pubDate },
      });
      return null;
    }
    return await prisma.episode.upsert({
      where: { podcastId_guid: { podcastId: podcast.id, guid }},
      create: {
        title,
        guid,
        publishDate,
        contentURL: enclosure.url,
        podcastId: podcast.id,
      },
      update: {
        title,
        publishDate,
        contentURL: enclosure.url,
      },
    });
  }));

  return await prisma.episode.findMany({
    where: { podcast },
    orderBy: { publishDate: 'desc' },
  })
}

export async function fetchLatestEpisode(prisma: PrismaClient, podcast: Podcast): Promise<Episode | null> {
  const [...episodes] = await fetchEpisodes(prisma, podcast);
  if (episodes.length === 0) {
    return null;
  }
  return episodes[0];
}

export async function chopEpisode(episode: DownloadedEpisode): Promise<Part[]> {
  const inputFile = path.resolve('downloads/media', episode.filename);
  const desinationDir = path.resolve('downloads/media', episode.guid);
  const desinationFile = path.resolve(desinationDir, '%03d.mp3');

  if (fs.existsSync(desinationDir)) {
    const files = await fs.promises.readdir(desinationDir);
    if (files.length > 0) {
      return files.map(f => ({
        filename: f,
        filePath: path.resolve(desinationDir, f),
      }));
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
  return files.map(f => ({
    filename: f,
    filePath: path.resolve(desinationDir, f),
  }));
}

function keyPrefixForEpisode(episode: Episode) {
  const yearString = episode.publishDate.getUTCFullYear().toString().padStart(4, '0');
  const monthString = (episode.publishDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const dayString = episode.publishDate.getUTCDate().toString().padStart(2, '0');
  const dateString = `${yearString}-${monthString}-${dayString}`;
  return `media/${dateString}/${episode.guid}/`;
}

async function upload(episode: Episode, part: Part, s3: S3Client, bucketName: string, bucketBaseURL: string): Promise<UploadedPart> {
  const filePath = path.resolve('downloads/media', episode.guid, part.filename);

  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (error) => {
    logger.error(`Error reading ${filePath}`, { error });
  });
  const keyPrefix = keyPrefixForEpisode(episode);
  const key = `${keyPrefix}${part.filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: 'audio/mpeg',
    CacheControl: 'max-age=604800' // 7 days
  });
  try {
    const result = await s3.send(command);
    logger.info(`Uploaded ${episode.guid} ${part.filename}`, { result });
    return {
      ...part,
      url: (new URL(key, bucketBaseURL)).toString(),
      key,
    };
  } catch (error) {
    logger.error(`Unable to upload "${filePath}" with key "${key}"`, { error, key });
    throw error;
  }
}

export async function uploadEpisodeParts(episode: Episode, parts: Part[], s3: S3Client, bucketName: string, bucketBaseURL: string): Promise<UploadedPart[]> {
  const keyPrefix = keyPrefixForEpisode(episode);

  const listCommand = new ListObjectsCommand({
    Bucket: bucketName,
    Prefix: keyPrefix,
  });

  const existingUploads = await s3.send(listCommand);
  if (existingUploads.Contents && existingUploads.Contents.length) {
    logger.info(`Parts already uploaded for episode "${episode.title}" with prefix "${keyPrefix}"`, { episode, count: existingUploads.Contents.length, keyPrefix });
    return existingUploads.Contents.map(p => ({
      filename: path.basename(p.Key!),
      key: p.Key!,
      url: (new URL(p.Key!, bucketBaseURL)).toString(),
      filePath: path.resolve('downloads', p.Key!),
    }));
  }

  const uploadedParts = await Promise.all(parts.map(p => upload(episode, p, s3, bucketName, bucketBaseURL)));
  logger.info(`Uploaded ${uploadedParts.length} for episode "${episode.title}" with prefix "${keyPrefix}"`, { episode, count: uploadedParts.length, keyPrefix });
  return uploadedParts;
}

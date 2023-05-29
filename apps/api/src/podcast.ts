import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import { spawn } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient, Podcast, Episode, EpisodeDownload } from '@prisma/client';

import logger, { loggableError } from './logger';
import download from './download';

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

interface TempFile {
  filename: string;
  filePath: string;
}

interface UploadedFile {
  url: string;
  key: string;
}

export async function downloadEpisode({ episode, ...episodeDownload }: EpisodeDownload & { episode: Episode }): Promise<{ filename: string }> {
  const filename = `${episodeDownload.id}.mp3`;
  if (!fs.existsSync('downloads/media')) {
    await fs.promises.mkdir('downloads/media', { recursive: true });
  }
  const destination = path.resolve('downloads/media', filename);
  if (fs.existsSync(destination)) {
    logger.info(`Episode "${episode.title}" already exists as "${filename}"`, { episode, filename });
    return { filename }
  }

  logger.info(`Downloading episode "${episode.title}" as "${filename}"`, { episode, filename });
  await download(episodeDownload.contentURL, destination);
  logger.info(`Finished downloading episode "${episode.title}" as "${filename}"`, { episode, filename });
  const { size } = await fs.promises.stat(destination);
  const sizeMegabytes = size / 1024 / 1024;
  if (sizeMegabytes < MIN_EPISODE_FILE_SIZE_MB) {
    fs.unlink(destination, () => {});
    logger.warning(`File "${destination}" is smaller than ${MIN_EPISODE_FILE_SIZE_MB} MB (${sizeMegabytes.toFixed(2)} MB). Considering this a download failure.`, { episodeDownload, filename, size });
    throw new Error(`File "${destination}" is smaller than ${MIN_EPISODE_FILE_SIZE_MB} MB (${sizeMegabytes.toFixed(2)} MB). Considering this a download failure.`);
  }
  return { filename };
}

export async function fetchEpisodes(prisma: PrismaClient, { id: podcastId }: Podcast): Promise<Episode[]> {
  const podcast = await prisma.podcast.findUniqueOrThrow({ where: { id: podcastId } });
  const now = new Date();

  if (!podcast.lastFetchDate
    || now.getTime() - podcast.lastFetchDate.getTime() > 1000 * 60 * 60
    || await prisma.episode.count({ where: { podcastId } }) === 0
  ) {
    logger.info(`Fetching feed for "${podcast.title}"`, { podcast });
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

    await prisma.podcast.update({
      where: { id: podcast.id },
      data: {
        lastFetchDate: now,
      }
    });
  } else {
    logger.debug(`Not re-fetching podcast "${podcast.title}", last fetched ${podcast.lastFetchDate}`, { podcast });
  }

  return await prisma.episode.findMany({
    where: { podcastId: podcast.id },
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

async function ffmpeg(args: string[], process: 'ffmpeg' | 'ffprobe' = 'ffmpeg'): Promise<{ stderr: string, stdout: string }> {
  return await new Promise<{ stderr: string, stdout: string }>((resolve, reject) => {
    const proc = spawn(process, args);
    let stdout = '';
    let stderr = ''
    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    proc.once('error', (error) => {
      reject(error);
    });
    proc.once('close', () => {
      resolve({ stdout, stderr });
    });
  });
}

export async function chopEpisode(episodeDownload: EpisodeDownload, filename: string): Promise<TempFile[]> {
  const inputFile = path.resolve('downloads/media', filename);
  const desinationDir = path.resolve('downloads/media', `${episodeDownload.id}`);

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

  const { stdout, stderr } = await ffmpeg(silencedetectArgs);

  const rawStartTimes: number[] = [];
  const startMatches = (stdout + stderr).matchAll(/silence_start: ([\d\.]+)/g);
  for (const match of startMatches) {
    rawStartTimes.push(Number(match[1]));
  }

  // Collapse short segments together
  const MIN_SEGMENT_LENGTH = 20;
  const startTimes = rawStartTimes.reduceRight((acc, startTime) => {
    const next = acc.at(0);
    if (next !== undefined && next - startTime < MIN_SEGMENT_LENGTH) {
      return [startTime, ...acc.slice(1)];
    } else {
      return [startTime, ...acc];
    }
  }, [] as number[]);

  // Split on those periods of silence

  const desinationFilePattern = path.resolve(desinationDir, `%5d.mp3`);

  const segmentArgs = [
    '-i', inputFile,
    '-f', 'segment',
    '-segment_times', startTimes.join(','),
    '-reset_timestamps', '1',
    '-map', '0:a',
    '-c:a', 'copy',
    desinationFilePattern,
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

export async function measureFiles<File extends TempFile>(files: File[]): Promise<(File & { size: number })[]> {
  return await Promise.all(files.map(f =>
    new Promise<File & { size: number }>((resolve, reject) => {
      fs.stat(f.filePath, (error, stats) => {
        if (error) {
          reject(error);
        } else if (stats) {
          resolve({ ...f, size: stats.size });
        }
      });
    })
  ));
}

export async function fileDurations<File extends TempFile>(files: File[]): Promise<(File & { duration: number})[]> {
  return await Promise.all(files.map(f =>
    new Promise<File & { duration: number }>(async (resolve) => {
      const args = [
        f.filePath,
        '-show_entries', 'format=duration',
        '-v', 'error',
        '-of', 'csv=p=0',
      ];
      const { stdout, stderr } = await ffmpeg(args, 'ffprobe');
      if (stderr.trim()) {
        logger.warning('ffprobe error', { file: f, error: stderr });
      }
      const duration = Number(stdout);
      resolve({ ...f, duration });
    })
  ));
}

function keyPrefixForDownload({ episode, ...episodeDownload }: EpisodeDownload & { episode: Episode & { podcast: Podcast } }) {
  const yearString = episode.publishDate.getUTCFullYear().toString().padStart(4, '0');
  const monthString = (episode.publishDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const dayString = episode.publishDate.getUTCDate().toString().padStart(2, '0');
  const dateString = `${yearString}-${monthString}-${dayString}`;
  return `media/${episode.podcast.id}/${dateString}-episode-${episode.id}/${episodeDownload.id}/`;
}

async function upload<File extends TempFile>(keyPrefix: string, tempFile: File, s3: S3Client, bucketName: string, bucketBaseURL: string): Promise<File & UploadedFile> {
  const fileStream = fs.createReadStream(tempFile.filePath);
  fileStream.on('error', (error) => {
    logger.error(`Error reading ${tempFile.filePath}`, { error: loggableError(error) });
  });
  const key = `${keyPrefix}${tempFile.filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: 'audio/mpeg',
    CacheControl: 'max-age=604800' // 7 days
  });
  try {
    const result = await s3.send(command);
    logger.info(`Uploaded ${keyPrefix} ${tempFile.filename}`, { result });
    return {
      ...tempFile,
      url: (new URL(key, bucketBaseURL)).toString(),
      key,
    };
  } catch (error) {
    logger.error(`Unable to upload "${tempFile.filePath}" with key "${key}"`, { error: loggableError(error), key, keyPrefix });
    throw error;
  }
}

export async function uploadEpisodeParts<File extends TempFile>(episodeDownload: EpisodeDownload & { episode: Episode & { podcast: Podcast } }, tempFiles: File[], s3: S3Client, bucketName: string, bucketBaseURL: string): Promise<(File & UploadedFile)[]> {
  const keyPrefix = keyPrefixForDownload(episodeDownload);
  const uploadedParts = await Promise.all(tempFiles.map(p => upload(keyPrefix, p, s3, bucketName, bucketBaseURL)));
  logger.info(`Uploaded ${uploadedParts.length} parts for episode "${episodeDownload.episode.title}" with prefix "${keyPrefix}"`, { episodeDownload, count: uploadedParts.length, keyPrefix });
  return uploadedParts;
}

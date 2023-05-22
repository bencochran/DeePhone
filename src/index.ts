import 'dotenv/config'

import express from 'express';
import http from 'http';
import twilio from 'twilio';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import path from 'path';
import PQueue from 'p-queue';

import logger from './logger.js';
import { fetchLatestEpisode, chopEpisode } from './podcast.js';

const app = express();
app.enable('trust proxy');
app.use(express.urlencoded({ extended: false }));

const requestQueue = new PQueue({ concurrency: 1 });

interface VoiceRequest {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed or no-answer';
  ApiVersion: string;
  Direction: 'inbound' | 'outbound-api' | 'outbound-dial';
  ForwardedFrom?: string;
  CallerName?: string;
  ParentCallSid?: string;
  CallToken: string;

  FromCity?: string;
  FromState?: string;
  FromZip?: string;
  FromCountry?: string;

  ToCity?: string;
  ToState?: string;
  ToZip?: string;
  ToCountry?: string;
}

interface VoiceStatusCallbackRequest extends VoiceRequest {
  CallDuration: string;
  RecordingUrl?: string;
  RecordingSid?: string;
  RecordingDuration?: string;
}

app.post('/voice', async (req, res) => {
  const voiceRequest: VoiceRequest = req.body;
  const voiceResponse = new twilio.twiml.VoiceResponse();

  logger.info(`New call from ${voiceRequest.From}`, { voiceRequest });

  try {
    const latestEpisode = await requestQueue.add(async () => {
      const latestEpisode = await fetchLatestEpisode()
      const parts = latestEpisode && await chopEpisode(latestEpisode);
      if (latestEpisode && parts && parts.length > 0) {
        return { ...latestEpisode, parts };
      }
      return null;
    });
    if (latestEpisode) {
      const today = utcToZonedTime(new Date(), 'America/New_York');
      const latest = utcToZonedTime(latestEpisode.date, 'America/New_York');
      const formattedToday = dateFormat(today, 'eeee, MMMM do');
      const formattedLatest = dateFormat(latest, 'eeee, MMMM do');
      const formattedAgo = formatDistance(latest, today, { addSuffix: true });

      voiceResponse.say({ voice: 'Polly.Matthew' }, `Hello. Today is ${formattedToday}. Here is the latest Ted Radio Hour from ${formattedLatest} (${formattedAgo}).`);
      latestEpisode.parts.forEach((part) => {
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

app.post('/voice/status-callback', async (req, res) => {
  const voiceRequest: VoiceStatusCallbackRequest = req.body;
  logger.info(`Status from ${voiceRequest.From}, status: ${voiceRequest.CallStatus}, duration: ${voiceRequest.CallDuration}`, { voiceRequest });
  const voiceResponse = new twilio.twiml.VoiceResponse();
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

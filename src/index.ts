import 'dotenv/config'

import express from 'express';
import http from 'http';
import twilio from 'twilio';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import path from 'path';

import logger from './logger.js';
import type { DownloadedEpisode, Part } from './podcast.js';
import {
  enqueueNewCall,
  getCallState,
  endCallState,
  incrementCallWaitingMessageCount,
  loggableStatus,
} from './call-states.js';
import type { VoiceRequest, VoiceStatusCallbackRequest } from './twilio-utilities.js';
import { geocodeVoiceRequestFrom } from './twilio-utilities.js';

const app = express();
app.enable('trust proxy');
app.use(express.urlencoded({ extended: false }));

function initialAnswerResponse() {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  const today = utcToZonedTime(new Date(), 'America/New_York');
  const formattedToday = dateFormat(today, 'eeee, MMMM do');

  // A bit of pause at the start so we don’t answer halfway though the first ring
  voiceResponse.pause({ length: 3 });

  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Hello, you're listening to Ted Radio Hour.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Today is ${formattedToday}.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.redirect('/voice');
  return voiceResponse;
}

function waitingResponse(waitingCount: number) {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  if (waitingCount === 0) {
    voiceResponse.pause({ length: 1 });
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Give me just a moment to find the latest episode.`);
  } else if (waitingCount === 1) {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `It’s taking a second, but I should have it ready soon.`);
    voiceResponse.pause({ length: 3 });
  } else if (waitingCount === 2) {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `I’m still working on it. Please bear with me.`);
    voiceResponse.pause({ length: 7 });
  } else if (waitingCount === 3) {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Sorry about this. I’m still loading the episode.`);
    voiceResponse.pause({ length: 7 });
  } else if (waitingCount === 4) {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `I’m still here. Things are a little slow today. Please stand by.`);
    voiceResponse.pause({ length: 10 });
  } else {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Sorry, still trying.`);
    voiceResponse.pause({ length: 7 });
  }
  voiceResponse.pause({ length: 7 });
  voiceResponse.redirect('/voice');
  return voiceResponse;
}

function playEpisodeResponse(episode: DownloadedEpisode, parts: Part[], waitingCount: number) {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  const today = utcToZonedTime(new Date(), 'America/New_York');
  const latest = utcToZonedTime(episode.date, 'America/New_York');
  const formattedLatest = dateFormat(latest, 'eeee, MMMM do');
  const formattedAgo = formatDistance(latest, today, { addSuffix: true });

  if (waitingCount === 0) {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Here’s the latest episode from ${formattedAgo}, ${formattedLatest}.`);
  } else {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Here it is.`);
    voiceResponse.pause({ length: 1 });
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `The latest episode from ${formattedAgo}, ${formattedLatest}.`);
  }
  parts.forEach((part) => {
    voiceResponse.play(`/media/${episode.guid}/${part.filename}`);
  });
  voiceResponse.pause({ length: 2 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `I hope you enjoyed the episode. Have a great day.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Goodbye.`);
  voiceResponse.pause({ length: 2 });
  return voiceResponse;
}

function noEpisodeResponse() {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Sorry, I was unable to find the latest Ted Radio Hour. Please call again later.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Goodbye.`);
  voiceResponse.pause({ length: 2 });
  return voiceResponse;
}

function errorResponse() {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Unfortunately, there was a problem loading the latest Ted Radio Hour. Please call again later.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Goodbye.`);
  voiceResponse.pause({ length: 2 });
  return voiceResponse;
}

app.post('/voice', async (req, res) => {
  const voiceRequest: VoiceRequest = req.body;

  const status = getCallState(voiceRequest.CallSid);

  (async () => {
    const geocodedFrom = await geocodeVoiceRequestFrom(voiceRequest);
    logger.info(`${status ? 'Continued' : 'New'} call from ${voiceRequest.From}`, { voiceRequest, status: loggableStatus(status), geocodedFrom });
  })();

  let voiceResponse: twilio.twiml.VoiceResponse;
  if (!status) {
    enqueueNewCall(voiceRequest.CallSid);
    voiceResponse = initialAnswerResponse();
  } else if (status.state.status === 'playing-episode') {
    voiceResponse = playEpisodeResponse(status.state.episode, status.state.parts, status.waitingMessageCount);
  } else if (status.state.status === 'no-episode') {
    voiceResponse = noEpisodeResponse();
  } else if (status.state.status === 'episode-error') {
    voiceResponse = errorResponse();
  } else {
    incrementCallWaitingMessageCount(voiceRequest.CallSid);
    voiceResponse = waitingResponse(status.waitingMessageCount)
  }

  res.type('text/xml');
  res.send(voiceResponse.toString());
});

app.post('/voice/status-callback', async (req, res) => {
  const voiceRequest: VoiceStatusCallbackRequest = req.body;
  logger.info(`Status from ${voiceRequest.From}, status: ${voiceRequest.CallStatus}, duration: ${voiceRequest.CallDuration}`, { voiceRequest });
  if (voiceRequest.CallStatus === 'completed' || voiceRequest.CallStatus === 'failed') {
    endCallState(voiceRequest.CallSid);
  }
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

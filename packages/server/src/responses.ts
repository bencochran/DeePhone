import twilio from 'twilio';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { EpisodePart } from '@prisma/client';

import type { PlayableDownload } from './call-states.js';

export function initialAnswerResponse() {
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

export function waitingResponse(waitingCount: number) {
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

export function introduceEpisodeResponse(playable: PlayableDownload, waitingCount: number) {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  const today = utcToZonedTime(new Date(), 'America/New_York');
  const latest = utcToZonedTime(playable.episode.publishDate, 'America/New_York');
  const formattedLatest = dateFormat(latest, 'eeee, MMMM do');
  const formattedAgo = formatDistance(latest, today, { addSuffix: true });

  if (waitingCount === 0) {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Here’s the latest episode from ${formattedAgo}, ${formattedLatest}.`);
  } else {
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Here it is.`);
    voiceResponse.pause({ length: 1 });
    voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `The latest episode from ${formattedAgo}, ${formattedLatest}.`);
  }
  voiceResponse.redirect('/voice');
  return voiceResponse;
}

export function playPartResponse(part: EpisodePart) {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.play(part.url);
  voiceResponse.redirect('/voice');
  return voiceResponse;
}

export function endEpisodeResponse() {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.pause({ length: 2 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `I hope you enjoyed the episode. Have a great day.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Goodbye.`);
  voiceResponse.pause({ length: 2 });
  return voiceResponse;
}

export function noEpisodeResponse() {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Sorry, I was unable to find the latest Ted Radio Hour. Please call again later.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Goodbye.`);
  voiceResponse.pause({ length: 2 });
  return voiceResponse;
}

export function errorResponse() {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Unfortunately, there was a problem loading the latest Ted Radio Hour. Please call again later.`);
  voiceResponse.pause({ length: 1 });
  voiceResponse.say({ voice: 'Polly.Stephen-Neural' }, `Goodbye.`);
  voiceResponse.pause({ length: 2 });
  return voiceResponse;
}

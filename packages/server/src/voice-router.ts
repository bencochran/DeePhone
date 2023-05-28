import { Router, urlencoded } from 'express';
import twilio from 'twilio';
import { PrismaClient, Podcast } from '@prisma/client';

import logger from './logger.js';
import {
  enqueueNewCall,
  getCallState,
  endCallState,
  incrementCallWaitingMessageCount,
  loggableStatus,
  advanceToNextPart,
} from './call-states.js';
import type { VoiceRequest, VoiceStatusCallbackRequest } from './twilio-utilities.js';
import { geocodeVoiceRequestFrom } from './twilio-utilities.js';
import {
  initialAnswerUnauthorizedResponse,
  initialAnswerResponse,
  waitingResponse,
  introduceEpisodeResponse,
  playPartResponse,
  endEpisodeResponse,
  noEpisodeResponse,
  errorResponse,
} from './responses.js';
import { TWILIO_AUTH_TOKEN } from './env.js';

export function buildRouter(prisma: PrismaClient, podcast: Podcast) {
  const router = Router();
  router.use(urlencoded({ extended: false }));

  router.post('/voice', async (req, res) => {
    const twilioSignature = req.header('X-Twilio-Signature');
    if (!twilioSignature) {
      logger.warning('Missing X-Twilio-Signature header', { headers: req.headers });
      const voiceResponse = initialAnswerUnauthorizedResponse();
      res.type('text/xml');
      res.send(voiceResponse.toString());
      return;
    }
    const url = new URL(req.url, `https://${req.hostname}`).toString()
    const valid = twilio.validateRequest(TWILIO_AUTH_TOKEN, twilioSignature, url, req.body);
    if (!valid) {
      logger.warning('Invalid /voice request', { headers: req.headers, body: req.body, url });
      const voiceResponse = initialAnswerUnauthorizedResponse();
      res.type('text/xml');
      res.send(voiceResponse.toString());
      return;
    }

    const voiceRequest: VoiceRequest = req.body;

    const status = getCallState(voiceRequest.CallSid);

    (async () => {
      const geocodedFrom = await geocodeVoiceRequestFrom(voiceRequest);
      logger.info(`${status ? 'Continued' : 'New'} call from ${voiceRequest.From}`, { voiceRequest, status: loggableStatus(status), geocodedFrom });
    })();

    let voiceResponse: twilio.twiml.VoiceResponse;
    if (!status) {
      enqueueNewCall(prisma, podcast, voiceRequest.CallSid);
      voiceResponse = initialAnswerResponse();
    } else if (status.state.status === 'introducing-episode') {
      advanceToNextPart(voiceRequest.CallSid);
      voiceResponse = introduceEpisodeResponse(status.state.playable, status.waitingMessageCount);
    } else if (status.state.status === 'playing-episode') {
      advanceToNextPart(voiceRequest.CallSid);
      const part = status.state.playable.parts[status.state.nextPartIndex];
      voiceResponse = playPartResponse(part);
    } else if (status.state.status === 'ending-episode') {
      voiceResponse = endEpisodeResponse();
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

  router.post('/voice/status-callback', async (req, res) => {
    const voiceRequest: VoiceStatusCallbackRequest = req.body;
    logger.info(`Status from ${voiceRequest.From}, status: ${voiceRequest.CallStatus}, duration: ${voiceRequest.CallDuration}`, { voiceRequest });
    if (voiceRequest.CallStatus === 'completed' || voiceRequest.CallStatus === 'failed') {
      endCallState(voiceRequest.CallSid);
    }
    const voiceResponse = new twilio.twiml.VoiceResponse();
    res.type('text/xml');
    res.send(voiceResponse.toString());
  });

  return router;
}

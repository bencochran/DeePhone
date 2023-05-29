import { Router, urlencoded } from 'express';
import twilio from 'twilio';
import { PrismaClient, Podcast } from '@prisma/client';

import logger, { loggableError } from './logger';
import {
  enqueueNewCall,
  getCallState,
  endCallState,
  incrementCallWaitingMessageCount,
  loggableStatus,
  advanceToNextPart,
} from './call-states';
import type { VoiceRequest, VoiceStatusCallbackRequest } from './twilio-utilities';
import { geocodeVoiceRequestFrom } from './twilio-utilities';
import {
  initialAnswerUnauthorizedResponse,
  initialAnswerResponse,
  waitingResponse,
  introduceEpisodeResponse,
  playPartResponse,
  endEpisodeResponse,
  noEpisodeResponse,
  errorResponse,
} from './responses';
import { TWILIO_AUTH_TOKEN } from './env';

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

    let voiceResponse: twilio.twiml.VoiceResponse;
    try {
      const voiceRequest: VoiceRequest = req.body;

      const status = await getCallState(prisma, voiceRequest);

      (async () => {
        const geocodedFrom = await geocodeVoiceRequestFrom(voiceRequest);
        logger.info(`${status ? 'Continued' : 'New'} call from ${voiceRequest.From}`, { voiceRequest, status: loggableStatus(status), geocodedFrom });
      })();

      if (!status) {
        await enqueueNewCall(prisma, podcast, voiceRequest);
        voiceResponse = initialAnswerResponse();
      } else if (status.state.status === 'introducing-episode') {
        await advanceToNextPart(prisma, voiceRequest);
        voiceResponse = introduceEpisodeResponse(status.state.playable, status.waitingMessageCount);
      } else if (status.state.status === 'playing-episode') {
        await advanceToNextPart(prisma, voiceRequest);
        voiceResponse = playPartResponse(status.state.part);
      } else if (status.state.status === 'ending-episode') {
        voiceResponse = endEpisodeResponse();
      } else if (status.state.status === 'no-episode') {
        voiceResponse = noEpisodeResponse();
      } else if (status.state.status === 'episode-error') {
        voiceResponse = errorResponse();
      } else {
        await incrementCallWaitingMessageCount(prisma, voiceRequest);
        voiceResponse = waitingResponse(status.waitingMessageCount)
      }
    } catch (error) {
      logger.error('Error handling call', { error: loggableError(error) });
      voiceResponse = errorResponse();
    }

    res.type('text/xml');
    res.send(voiceResponse.toString());
  });

  router.post('/voice/status-callback', async (req, res) => {
    const voiceRequest: VoiceStatusCallbackRequest = req.body;
    logger.info(`Status from ${voiceRequest.From}, status: ${voiceRequest.CallStatus}, duration: ${voiceRequest.CallDuration}`, { voiceRequest });
    if (voiceRequest.CallStatus === 'completed' || voiceRequest.CallStatus === 'failed') {
      const twilioSignature = req.header('X-Twilio-Signature');
      if (twilioSignature) {
        const url = new URL(req.url, `https://${req.hostname}`).toString()
        const valid = twilio.validateRequest(TWILIO_AUTH_TOKEN, twilioSignature, url, req.body);
        if (valid) {
          const duration = Number(voiceRequest.CallDuration);
          endCallState(prisma, voiceRequest, Number.isInteger(duration) ? duration : undefined);
        }
      }
    }
    const voiceResponse = new twilio.twiml.VoiceResponse();
    res.type('text/xml');
    res.send(voiceResponse.toString());
  });

  return router;
}

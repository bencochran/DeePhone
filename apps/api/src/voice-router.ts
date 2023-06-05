import { Router, Request, Response, NextFunction, urlencoded } from 'express';
import twilio from 'twilio';
import { PrismaClient, Podcast } from '@prisma/client';

import logger, { loggableError, loggableObject } from './logger';
import { handleVoiceRequest, handleCallStatus } from './call-states';
import type {
  VoiceRequest,
  VoiceStatusCallbackRequest,
} from './twilio-utilities';
import { geocodeVoiceRequestFrom } from './twilio-utilities';
import {
  initialAnswerUnauthorizedResponse,
  voiceResponseForResponse,
  errorResponse,
} from './responses';
import { TWILIO_AUTH_TOKEN } from './env';

function validateTwilioRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug(`Validating Twilio request for URL: ${req.originalUrl}`, {
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    method: req.method,
  });

  if (req.method !== 'POST') {
    logger.info(
      `Skipping Twilio validation for non-POST method "${req.method}"`,
      {
        originalUrl: req.originalUrl,
        hostname: req.hostname,
        method: req.method,
      }
    );
    next();
    return;
  }

  const twilioSignature = req.header('X-Twilio-Signature');
  if (!twilioSignature) {
    logger.warning('Missing X-Twilio-Signature header', {
      headers: req.headers,
    });
    const voiceResponse = initialAnswerUnauthorizedResponse();
    res.type('text/xml');
    res.send(voiceResponse.toString());
    return;
  }
  const url = new URL(req.originalUrl, `https://${req.hostname}`).toString();
  const valid = twilio.validateRequest(
    TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    req.body
  );
  if (!valid) {
    logger.warning(`Invalid ${req.url} request`, {
      headers: req.headers,
      body: req.body,
      url,
    });
    const voiceResponse = initialAnswerUnauthorizedResponse();
    res.type('text/xml');
    res.send(voiceResponse.toString());
    return;
  }
  next();
}

export function buildRouter(prisma: PrismaClient, podcast: Podcast) {
  const router = Router();
  router.use(urlencoded({ extended: false }));
  router.use(validateTwilioRequest);

  router.post('/', async (req, res) => {
    let voiceResponse: twilio.twiml.VoiceResponse;
    try {
      const voiceRequest: VoiceRequest = req.body;
      const callResponse = await handleVoiceRequest(
        prisma,
        podcast,
        voiceRequest
      );

      (async () => {
        const geocodedFrom = await geocodeVoiceRequestFrom(
          prisma,
          voiceRequest
        );
        logger.info(`Handling voice request from ${voiceRequest.From}`, {
          voiceRequest,
          callResponse: loggableObject(callResponse, { maxDepth: 4 }),
          geocodedFrom,
        });
      })();

      voiceResponse = voiceResponseForResponse(callResponse, req.originalUrl);
    } catch (error) {
      logger.error('Error handling call', { error: loggableError(error) });
      voiceResponse = errorResponse();
    }
    res.type('text/xml');
    res.send(voiceResponse.toString());
  });

  router.post('/status-callback', async (req, res) => {
    const voiceRequest: VoiceStatusCallbackRequest = req.body;
    logger.info(
      `Status from ${voiceRequest.From}, status: ${voiceRequest.CallStatus}, duration: ${voiceRequest.CallDuration}`,
      { voiceRequest }
    );

    await handleCallStatus(prisma, voiceRequest);
    const voiceResponse = new twilio.twiml.VoiceResponse();
    res.type('text/xml');
    res.send(voiceResponse.toString());
  });

  return router;
}

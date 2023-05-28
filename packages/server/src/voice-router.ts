import { Router, urlencoded } from 'express';
import twilio from 'twilio';
import { format as dateFormat, formatDistance } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import logger from './logger.js';
import type { DownloadedEpisode, UploadedPart } from './podcast.js';
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
  initialAnswerResponse,
  waitingResponse,
  introduceEpisodeResponse,
  playPartResponse,
  endEpisodeResponse,
  noEpisodeResponse,
  errorResponse,
} from './responses.js';

export function buildRouter() {
  const router = Router();
  router.use(urlencoded({ extended: false }));

  router.post('/voice', async (req, res) => {
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
    } else if (status.state.status === 'introducing-episode') {
      advanceToNextPart(voiceRequest.CallSid);
      voiceResponse = introduceEpisodeResponse(status.state.episode, status.waitingMessageCount);
    } else if (status.state.status === 'playing-episode') {
      advanceToNextPart(voiceRequest.CallSid);
      const part = status.state.parts[status.state.nextPartIndex];
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

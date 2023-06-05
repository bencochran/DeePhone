import axios from 'axios';
import { PrismaClient } from '@prisma/client';

import logger, { loggableError } from './logger';

export interface VoiceRequest {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus:
    | 'queued'
    | 'ringing'
    | 'in-progress'
    | 'completed'
    | 'busy'
    | 'failed'
    | 'no-answer';
  ApiVersion: string;
  Direction: 'inbound' | 'outbound-api' | 'outbound-dial';
  ForwardedFrom?: string;
  CallerName?: string;
  ParentCallSid?: string;
  CallToken: string;

  Digits?: string;

  FromCity?: string;
  FromState?: string;
  FromZip?: string;
  FromCountry?: string;

  ToCity?: string;
  ToState?: string;
  ToZip?: string;
  ToCountry?: string;
}

export interface VoiceStatusCallbackRequest extends VoiceRequest {
  CallDuration: string;
  RecordingUrl?: string;
  RecordingSid?: string;
  RecordingDuration?: string;
}

interface LatitudeAndLongitude {
  latitude: number;
  longitude: number;
}

export async function geocodeVoiceRequestFrom(
  prisma: PrismaClient,
  voiceRequest: VoiceRequest
): Promise<LatitudeAndLongitude | null> {
  if (
    !process.env.GEONAMES_USERNAME ||
    !voiceRequest.FromCountry ||
    !voiceRequest.FromZip
  ) {
    return null;
  }

  const cached = await prisma.postalCodeLocation.findUnique({
    where: {
      postalCode_country: {
        postalCode: voiceRequest.FromZip,
        country: voiceRequest.FromCountry,
      },
    },
  });

  if (cached) {
    logger.debug(
      `Geocoding cache hit for ${voiceRequest.FromZip} in ${voiceRequest.FromCountry}`,
      {
        voiceRequest,
        cached,
      }
    );
    return { latitude: cached.latitude, longitude: cached.longitude };
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.set('maxRows', '1');
    searchParams.set('username', process.env.GEONAMES_USERNAME);
    searchParams.set('country', voiceRequest.FromCountry);
    searchParams.set('postalcode', voiceRequest.FromZip);
    const url = new URL('http://api.geonames.org/postalCodeSearchJSON');
    url.search = searchParams.toString();
    logger.info(`Geocoding fetching: ${url.toString()}`);
    const response = await axios.get(url.toString(), { timeout: 10 * 1000 });
    logger.debug(`Geocoding got response`, {
      voiceRequest,
      response: { data: response.data },
    });
    if (
      'postalCodes' in response.data &&
      Array.isArray(response.data.postalCodes) &&
      response.data.postalCodes.length > 0
    ) {
      const first = response.data.postalCodes[0];
      if ('lng' in first && 'lat' in first) {
        const result = { longitude: first.lng, latitude: first.lat };
        logger.info(`Geocoding result: ${url.toString()}`);

        prisma.postalCodeLocation.upsert({
          where: {
            postalCode_country: {
              postalCode: voiceRequest.FromZip,
              country: voiceRequest.FromCountry,
            },
          },
          create: {
            postalCode: voiceRequest.FromZip,
            country: voiceRequest.FromCountry,
            latitude: result.latitude,
            longitude: result.longitude,
            fetchDate: new Date(),
          },
          update: {
            latitude: result.latitude,
            longitude: result.longitude,
            fetchDate: new Date(),
          },
        });
        return result;
      }
    }
    logger.warning(`Geocoding got no results`, {
      voiceRequest,
      response: { data: response.data },
    });
    return null;
  } catch (error) {
    logger.warning('Failed to geocode', {
      error: loggableError(error),
      voiceRequest,
    });
    return null;
  }
}

import axios from 'axios';

import logger from './logger.js';

export interface VoiceRequest {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer';
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

interface LatitudeAndLongtude {
  latitude: number;
  longitude: number;
}

const geocodeCache: Record<string, LatitudeAndLongtude> = {};

export async function geocodeVoiceRequestFrom(voiceRequest: VoiceRequest): Promise<LatitudeAndLongtude | null> {
  if (!process.env.GEONAMES_USERNAME || !voiceRequest.FromCountry || !voiceRequest.FromZip) {
    return null;
  }
  try {
    const cacheKey = `${voiceRequest.FromCountry}-${voiceRequest.FromZip}`;
    if (cacheKey in geocodeCache) {
      const cached = geocodeCache[cacheKey];
      logger.debug(`Geocoding cache hit for "${cacheKey}"`, { voiceRequest, cached });
      return cached;
    }
    const searchParams = new URLSearchParams();
    searchParams.set('maxRows', '1');
    searchParams.set('username', process.env.GEONAMES_USERNAME);
    searchParams.set('country', voiceRequest.FromCountry)
    searchParams.set('postalcode', voiceRequest.FromZip)
    const url = new URL('http://api.geonames.org/postalCodeSearchJSON');
    url.search = searchParams.toString();
    logger.info(`Geocoding fetching: ${url.toString()}`);
    const response = await axios.get(url.toString(), { timeout: 10 * 1000 });
    logger.debug(`Geocoding got response`, { voiceRequest, response: { data: response.data } });
    if ('postalCodes' in response.data && Array.isArray(response.data.postalCodes) && response.data.postalCodes.length > 0) {
      const first = response.data.postalCodes[0];
      if ('lng' in first && 'lat' in first) {
        const result = { longitude: first.lng, latitude: first.lat };
        logger.info(`Geocoding result: ${url.toString()}`);
        geocodeCache[cacheKey] = result;
        return result;
      }
    }
    return null;
  } catch (error) {
    logger.warning('Failed to geocode', { error, voiceRequest })
    return null;
  }
}

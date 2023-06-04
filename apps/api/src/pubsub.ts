import { createPubSub } from 'graphql-yoga';
import type { Call, CallEvent, Episode } from '@prisma/client';

export interface PubSubEvent {}

export interface PubSubCallUpdated extends PubSubEvent {
  call: Call;
  event: CallEvent;
}

export interface PubSubNewCall extends PubSubEvent {
  call: Call;
}

export interface PubSubEpisodeUpdated extends PubSubEvent {
  episode: Episode;
}

export interface PubSubEpisodeNewCall extends PubSubEvent {
  episode: Episode;
  call: Call;
}

export interface PubSubEvents extends Record<string, [PubSubEvent] | [string | number, PubSubEvent]> {
  callUpdated: [number, PubSubCallUpdated];
  newCall: [PubSubNewCall];
  episodeUpdated: [number, PubSubEpisodeUpdated];
  episodeNewCall: [number, PubSubEpisodeNewCall];
}

export const pubsub = createPubSub<PubSubEvents>({});

import { createPubSub } from 'graphql-yoga';
import type { Call, CallEvent } from '@prisma/client';

export interface PubSubEvent {}

export interface PubSubCallUpdated extends PubSubEvent {
  call: Call;
  event: CallEvent;
}

export interface PubSubNewCall extends PubSubEvent {
  call: Call;
}

export interface PubSubEvents extends Record<string, [PubSubEvent] | [string | number, PubSubEvent]> {
  callUpdated: [number, PubSubCallUpdated];
  newCall: [PubSubNewCall];
}

export const pubsub = createPubSub<PubSubEvents>({});

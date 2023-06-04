import { buildBuilder } from '../builder';
import { Types } from '../types';

import { addCallConnectionToBuilder } from './CallConnection';
import { addCallEventsConnectionToBuilder } from './CallEventsConnection';

export function addConnectionsToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  addCallConnectionToBuilder(builder, types);
  const CallEventsConnection = addCallEventsConnectionToBuilder(builder, types);

  return {
    CallEventsConnection,
  };
}

export type Connections = ReturnType<typeof addConnectionsToBuilder>;

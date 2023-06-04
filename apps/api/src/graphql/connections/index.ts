import { buildBuilder } from '../builder';
import { Types } from '../types';

import { addCallConnectionToBuilder } from './CallConnection';

export function addConnectionsToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  addCallConnectionToBuilder(builder, types);
}

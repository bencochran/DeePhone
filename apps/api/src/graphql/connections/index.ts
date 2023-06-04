import { buildBuilder } from '../builder';
import { addCallConnectionToBuilder } from './CallConnection';
import { Types } from '../types';

export function addConnectionsToBuilder(builder: ReturnType<typeof buildBuilder>, types: Types) {
  addCallConnectionToBuilder(builder, types);
}

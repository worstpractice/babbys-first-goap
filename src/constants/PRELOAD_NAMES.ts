import { AGENT_NAMES } from './AGENT_NAMES';
import { STATION_NAMES } from './STATION_NAMES';

export const PRELOAD_NAMES = [
  //
  ...AGENT_NAMES,
  ...STATION_NAMES,
  'grass',
] as const;

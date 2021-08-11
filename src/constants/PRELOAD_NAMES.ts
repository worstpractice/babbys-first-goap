import { AGENT_NAMES } from 'src/constants/AGENT_NAMES';
import { STATION_NAMES } from 'src/constants/STATION_NAMES';

export const PRELOAD_NAMES = [
  //
  ...AGENT_NAMES,
  ...STATION_NAMES,
  'grass',
] as const;

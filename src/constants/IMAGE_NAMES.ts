import { AGENT_NAMES } from 'src/constants/AGENT_NAMES';
import { STATION_NAMES } from 'src/constants/STATION_NAMES';

/** NOTE: the later an image appears in this array, the higher its Z-value will be in the scene. */
export const IMAGE_NAMES = [
  //
  ...STATION_NAMES,
  ...AGENT_NAMES,
] as const;

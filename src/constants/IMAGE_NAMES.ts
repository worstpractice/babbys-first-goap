import { AGENT_NAMES } from './AGENT_NAMES';
import { DOODAD_NAMES } from './DOODAD_NAMES';

/** NOTE: the later an image appears in this array, the higher its Z-value will be in the scene. */
export const IMAGE_NAMES = [
  //
  ...DOODAD_NAMES,
  ...AGENT_NAMES,
] as const;

import { AGENT_NAMES } from './AGENT_NAMES';
import { DOODAD_NAMES } from './DOODAD_NAMES';

export const SPRITE_NAMES = [
  //
  ...AGENT_NAMES,
  ...DOODAD_NAMES,
] as const;

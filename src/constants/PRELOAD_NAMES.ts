import { AGENT_NAMES } from './AGENT_NAMES';
import { DOODAD_NAMES } from './DOODAD_NAMES';

export const PRELOAD_NAMES = [
  //
  ...AGENT_NAMES,
  ...DOODAD_NAMES,
  'grass',
] as const;

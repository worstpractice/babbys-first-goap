import type { State } from '../typings/State';
import type { Personal } from '../typings/Personal';

export const startingStates: Personal<State> = {
  blacksmith: {
    HasOre: true,
    HasTool: false,
  },
  miner: {
    HasOre: false,
    HasTool: true,
  },
} as const;

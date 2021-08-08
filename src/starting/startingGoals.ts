import type { Fact } from '../typings/Fact';
import type { Personal } from '../typings/Personal';

export const startingGoals: Personal<Fact> = {
  blacksmith: {
    name: 'has_pickaxe',
    value: true,
  },
  miner: {
    name: 'has_ore',
    value: true,
  },
} as const;

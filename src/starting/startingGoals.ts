import type { Goal } from '../typings/Fact';
import type { Personal } from '../typings/Personal';

export const startingGoals: Personal<Goal> = {
  blacksmith: {
    name: 'has_pickaxe',
    value: true,
  },
  miner: {
    name: 'has_ore',
    value: true,
  },
} as const;

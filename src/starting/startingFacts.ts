import type { Personal } from '../typings/Personal';
import type { Facts } from '../typings/tables/Facts';

export const startingFacts: Personal<Facts> = {
  blacksmith: {
    has_ore: false,
    has_pickaxe: false,
  },
  miner: {
    has_ore: false,
    has_pickaxe: true,
  },
} as const;

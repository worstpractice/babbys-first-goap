import type { Personal } from '../typings/Personal';
import type { Predicate } from '../typings/Predicate';
import type { Facts } from '../typings/tables/Facts';

export const startingFacts: Personal<Facts> = {
  // new Proxy(
  blacksmith: {
    has_ore: false,
    has_pickaxe: false,
  },
  // {
  //   get: <T extends Predicate>(target: Facts, key: T) => {
  //     console.log(`blacksmith: ${String(key)} is ${String(target[key])}`);

  //     return target[key];
  //   },
  //   set: <T extends Predicate>(target: Facts, key: T, value: boolean) => {
  //     console.log(`blacksmith: setting ${String(key)} to ${value} (was ${String(target[key])})`);

  //     target[key] = value;

  //     return true;
  //   },
  // },
  // ),
  miner: {
    has_ore: false,
    has_pickaxe: true,
  },
} as const;

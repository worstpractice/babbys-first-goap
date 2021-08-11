import { DeliverOre } from '../actions/DeliverOre';
import { DeliverPickaxe } from '../actions/DeliverPickaxe';
import { ForgePickaxe } from '../actions/ForgePickaxe';
import { MineOre } from '../actions/MineOre';
import { RetrieveOre } from '../actions/RetrieveOre';
import { RetrievePickaxe } from '../actions/RetrievePickaxe';
import type { LazyAction } from '../typings/LazyAction';
import type { Personal } from '../typings/Personal';
import { startingPositions } from './startingPositions';

export const startingActions: Personal<readonly LazyAction[]> = {
  blacksmith: [
    //
    [
      DeliverPickaxe,
      {
        cost: 1,
        position: startingPositions.pickaxe_deposit,
      },
    ],
    [
      ForgePickaxe,
      {
        cost: 4,
        position: startingPositions.forge,
      },
    ],
    [
      RetrieveOre,
      {
        cost: 1,
        position: startingPositions.ore_deposit,
      },
    ],
  ],

  miner: [
    //
    [
      DeliverOre,
      {
        cost: 1,
        position: startingPositions.ore_deposit,
      },
    ],
    [
      MineOre,
      {
        cost: 4,
        position: startingPositions.vein,
      },
    ],
    [
      RetrievePickaxe,
      {
        cost: 1,
        position: startingPositions.pickaxe_deposit,
      },
    ],
  ],
} as const;

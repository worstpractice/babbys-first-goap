import { DeliverOre } from 'src/actions/DeliverOre';
import { DeliverPickaxe } from 'src/actions/DeliverPickaxe';
import { ForgePickaxe } from 'src/actions/ForgePickaxe';
import { MineOre } from 'src/actions/MineOre';
import { RetrieveOre } from 'src/actions/RetrieveOre';
import { RetrievePickaxe } from 'src/actions/RetrievePickaxe';
import { startingPositions } from 'src/starting/startingPositions';
import type { LazyAction } from 'src/typings/LazyAction';
import type { AgentName } from 'src/typings/names/AgentName';
import type { Table } from 'src/typings/Table';

export const startingActions: Table<AgentName, readonly LazyAction[]> = {
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

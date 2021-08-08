import { CraftPickaxe } from '../actions/CraftPickaxe';
import { DeliverOre } from '../actions/DeliverOre';
import { DeliverPickaxe } from '../actions/DeliverPickaxe';
import { RetrieveOre } from '../actions/RetrieveOre';
import { RetrievePickaxe } from '../actions/RetrievePickaxe';
import { UsePickaxe } from '../actions/UsePickaxe';
import type { ActionName } from '../typings/ActionName';
import type { DerivedAction } from '../typings/DerivedAction';
import type { Personal } from '../typings/Personal';
import type { Position } from '../typings/Position';
import { startingPositions } from './startingPositions';

export const startingActions: Personal<readonly (readonly [ActionName, DerivedAction, Position])[]> = {
  blacksmith: [
    //
    ['retrieve_ore', RetrieveOre, startingPositions.ore_deposit],
    ['craft_pickaxe', CraftPickaxe, startingPositions.forge],
    ['deliver_pickaxe', DeliverPickaxe, startingPositions.pickaxe_deposit],
  ],
  miner: [
    //
    ['retrieve_ore', UsePickaxe, startingPositions.ore],
    ['deliver_ore', DeliverOre, startingPositions.ore_deposit],
    ['retrieve_pickaxe', RetrievePickaxe, startingPositions.pickaxe_deposit],
  ],
} as const;

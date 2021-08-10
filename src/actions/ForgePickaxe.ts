import type { Agent } from '../ai/Agent';
import { storedQuantities } from "../data/storedQuantities";
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class ForgePickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    this.exchanges('ore', 'pickaxe');
  }

  // canExecute(this: this): boolean {
  //   return true;
  //   // return Boolean(this.agent.currentFacts.has_ore);
  //   // return Boolean(storedQuantities.ore);
  // }

  execute(this: this): void {
    console.count(this.constructor.name);

    // storedQuantities.ore--;
  }
}

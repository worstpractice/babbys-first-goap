import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class ForgePickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.exchanges('ore', 'pickaxe');
  }

  canExecute(this: this): boolean {
    return true;
    // return Boolean(this.agent.facts.has_ore);
    // return Boolean(storedQuantities.ore);
  }

  execute(this: this): void {
    // storedQuantities.ore--;
  }
}

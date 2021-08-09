import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class RetrieveOre extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.from('has_ore', false);
    this.from('has_pickaxe', false);
    this.to('has_ore', true);
  }

  canExecute(this: this): boolean {
    return Boolean(storedQuantities.ore);
  }

  execute(this: this): void {
    storedQuantities.ore--;
  }
}

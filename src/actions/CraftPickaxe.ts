import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class CraftPickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    this.addPrecondition('has_ore', true);
    this.addPrecondition('has_pickaxe', false);
    this.addEffect('has_ore', false);
    this.addEffect('has_pickaxe', true);
  }

  canExecute() {
    return Boolean(storedQuantities.ore);
  }

  execute() {
    storedQuantities.ore--;
  }
}

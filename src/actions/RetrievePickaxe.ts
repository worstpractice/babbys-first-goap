import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class RetrievePickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.addPrecondition('has_ore', false);
    this.addPrecondition('has_pickaxe', false);
    this.addEffect('has_pickaxe', true);
  }

  canExecute() {
    return Boolean(storedQuantities.pickaxe);
  }

  execute() {
    storedQuantities.pickaxe--;
  }
}

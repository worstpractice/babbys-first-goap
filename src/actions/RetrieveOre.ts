import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class RetrieveOre extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.retrieves('ore');
  }

  canExecute(this: this): boolean {
    return Boolean(storedQuantities.ore);
  }

  execute(this: this): void {
    console.count(this.constructor.name);

    storedQuantities.ore--;
  }
}

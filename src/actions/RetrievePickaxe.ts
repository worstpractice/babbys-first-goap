import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { arePreconditionsMet } from '../utils/arePreconditionsMet';
import { Action } from './Action';

export class RetrievePickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.retrieves('pickaxe');
  }

  canExecute(this: this): boolean {
    return arePreconditionsMet(this.agent, this) && Boolean(storedQuantities.pickaxe); // Weird outside dependency, should not be here
  }

  execute(this: this): void {
    console.count(`${this.agent.name}: ${this.constructor.name}`);

    storedQuantities.pickaxe--; // 🤦‍♂️
  }
}

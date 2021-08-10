import { storedQuantities } from '../data/storedQuantities';
import { arePreconditionsMet } from '../utils/arePreconditionsMet';
import type { ActionProps } from './Action';
import { Action } from './Action';

export class RetrievePickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

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

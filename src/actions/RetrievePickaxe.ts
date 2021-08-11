import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';
import { storedQuantities } from 'src/data/storedQuantities';
import { arePreconditionsMet } from 'src/utils/arePreconditionsMet';

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

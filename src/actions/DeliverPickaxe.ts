import { storedQuantities } from '../data/storedQuantities';
import type { ActionProps } from './Action';
import { Action } from './Action';

export class DeliverPickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.delivers('pickaxe');
  }

  execute(this: this): void {
    console.count(`${this.agent.name}: ${this.constructor.name}`);

    storedQuantities.pickaxe++;
  }
}

import { storedQuantities } from '../data/storedQuantities';
import type { ActionProps } from './Action';
import { Action } from './Action';

export class DeliverOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.delivers('ore');
  }

  execute(this: this): void {
    console.count(`${this.agent.name}: ${this.constructor.name}`);

    storedQuantities.ore++;
  }
}

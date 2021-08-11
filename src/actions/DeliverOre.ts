import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';
import { storedQuantities } from 'src/data/storedQuantities';

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

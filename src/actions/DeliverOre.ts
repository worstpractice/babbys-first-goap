import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';

export class DeliverOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willDeliver('ore');
  }

  execute(this: this): void {
    console.count(`🔨 ${this.agent.name} -> ${this.name}`);
  }
}

import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';

export class DeliverPickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willDeliver('pickaxe');
  }

  execute(this: this): void {
    console.count(`🔨 ${this.agent.name} -> ${this.name}`);
  }
}

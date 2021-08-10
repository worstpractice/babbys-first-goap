import type { ActionProps } from './Action';
import { Action } from './Action';

export class ForgePickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.exchanges('ore', 'pickaxe');
  }

  execute(this: this): void {
    console.count(`${this.agent.name}: ${this.constructor.name}`);
  }
}

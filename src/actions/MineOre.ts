import { coinFlip } from '../utils/coinFlip';
import type { ActionProps } from './Action';
import { Action } from './Action';

export class MineOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.mustHave('pickaxe');
    this.retrieves('ore');
  }

  execute(this: this): void {
    console.count(`${this.agent.name}: ${this.constructor.name}`);

    if (coinFlip()) return;

    console.log('Tool broke while mining :(');

    this.agent.loses('pickaxe');
  }
}

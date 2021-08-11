import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';
import { coinFlip } from 'src/utils/coinFlip';

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

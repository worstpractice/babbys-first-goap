import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';
import { coinFlip } from 'src/utils/coinFlip';

export class MineOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.mustHave('pickaxe');
    this.willRetrieve('ore');
  }

  execute(this: this): void {
    console.count(`🔨 ${this.agent.name} -> ${this.name}`);

    if (coinFlip()) return;

    console.count(`🤷 ${this.agent.name} -> pickaxe broke`);

    this.agent.loses('pickaxe');
  }
}

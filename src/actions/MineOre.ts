import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';

export class MineOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.mustHave('pickaxe');
    this.willRetrieve('ore');
  }
}

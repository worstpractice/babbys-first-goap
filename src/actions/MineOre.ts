import type { ActionProps } from 'src/typings/props/ActionProps';
import { Action } from 'src/entities/Action';

export class MineOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.mustHave('pickaxe');
    this.willRetrieve('ore');
  }
}

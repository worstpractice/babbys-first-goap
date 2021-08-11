import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';

export class ForgePickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willExchange('ore', 'pickaxe');
  }
}

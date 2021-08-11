import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';

export class DeliverOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willDeliver('ore');
  }
}

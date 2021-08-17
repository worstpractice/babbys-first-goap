import type { ActionProps } from 'src/typings/props/ActionProps';
import { Action } from 'src/entities/Action';

export class DeliverOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willDeliver('ore');
  }
}

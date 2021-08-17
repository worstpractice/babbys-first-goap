import type { ActionProps } from 'src/typings/props/ActionProps';
import { Action } from 'src/entities/Action';

export class DeliverPickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willDeliver('pickaxe');
  }
}

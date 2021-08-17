import type { ActionProps } from 'src/typings/props/ActionProps';
import { Action } from 'src/entities/Action';

export class RetrievePickaxe extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willRetrieve('pickaxe');
  }
}

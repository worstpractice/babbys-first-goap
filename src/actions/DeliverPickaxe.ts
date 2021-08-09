import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class DeliverPickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.from('has_pickaxe', true);

    this.to('has_pickaxe', false);
  }

  execute(this: this): void {
    storedQuantities.pickaxe++;
  }
}
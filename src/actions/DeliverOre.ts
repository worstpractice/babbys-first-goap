import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class DeliverOre extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.delivers('ore');
  }

  canExecute(this: this): boolean {
    return this.agent.has('ore'); // Should not really be here, but prevents race conditions atm
  }

  execute(this: this): void {
    console.count(this.constructor.name);

    storedQuantities.ore++;
  }
}

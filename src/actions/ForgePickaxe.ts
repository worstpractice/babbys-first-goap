import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class ForgePickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    this.exchanges('ore', 'pickaxe');
  }

  canExecute(this: this): boolean {
    return this.agent.has('ore'); // Should not really be here, but prevents race conditions atm
  }

  execute(this: this): void {
    console.count(this.constructor.name);
  }
}

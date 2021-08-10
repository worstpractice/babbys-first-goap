import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class MineOre extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    this.mustHave('pickaxe');
    this.retrieves('ore');
  }

  canExecute(this: this): boolean {
    return !this.agent.has('ore'); // Should not really be here, but prevents race conditions atm
  }

  execute(this: this): void {
    console.count(this.constructor.name);

    if (Math.random() > 0.5) return;

    console.log('Tool broke while mining :(');

    this.agent.loses('pickaxe');
  }
}

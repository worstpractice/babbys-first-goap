import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { coinFlip } from '../utils/coinFlip';
import { Action } from './Action';

export class MineOre extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    this.mustHave('pickaxe');
    this.retrieves('ore');
  }

  execute(this: this): void {
    console.count(`${this.agent.name}: ${this.constructor.name}`);

    if (coinFlip()) return;

    console.log('Tool broke while mining :(');

    this.agent.loses('pickaxe');
  }
}

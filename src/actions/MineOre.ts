import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class MineOre extends Action {
  private mineCounter = 0;

  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 1, position, agent);

    this.mustHave('pickaxe');
    this.retrieves('ore');
  }

  execute(this: this): void {
    this.mineCounter++;

    if (this.mineCounter < 4) return;

    console.log('Tool broke while mining :(');

    this.agent.setState('has_pickaxe', false);
    this.mineCounter = 0;
  }
}

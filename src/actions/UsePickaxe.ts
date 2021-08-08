import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class UsePickaxe extends Action {
  #mineCounter = 0;

  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    this.addPrecondition('has_ore', false);
    this.addPrecondition('has_pickaxe', true);

    this.addEffect('has_ore', true);
  }

  execute() {
    this.#mineCounter++;

    if (this.#mineCounter < 4) return;

    console.log('Tool broke while mining :(');

    if (!this.agent) throw new ReferenceError('missing agent!');

    this.agent.setState('has_pickaxe', false);
    this.#mineCounter = 0;
  }
}

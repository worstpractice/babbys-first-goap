import type { Agent } from '../ai/Agent';
import { storedQuantities } from '../data/storedQuantities';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import { Action } from './Action';

export class CraftPickaxe extends Action {
  constructor(name: ActionName, position: Position, agent: Agent) {
    super(name, 4, position, agent);

    // this.exchanges('ore', 'pickaxe');

    // this.gains('pickaxe')
    // this.loses('ore')

    // this.from('has_ore', true);
    // this.from('has_pickaxe', false);

    // const foo = has('has_ore');

    // this.to('has_ore', false);
    // this.to('has_pickaxe', true);
  }

  canExecute(this: this): boolean {
    return Boolean(this.agent.state.has_ore);
  }

  execute(this: this): void {
    storedQuantities.ore--;
  }
}

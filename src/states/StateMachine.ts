import type { State } from '../typings/State';
import type { StateName } from '../typings/StateName';
import type { States } from '../typings/States';

// Every object that offers the following methods can be used as a State:
// enter, leave, update
export class StateMachine {
  states: { [key in StateName]?: States[key] } = {};

  state: States[StateName] | null = null;

  add<T extends StateName>(this: this, name: T, state: States[T]): void {
    this.states[name] = state;
  }

  enter<T extends StateName>(this: this, name: T): void {
    if (this.state) this.state.leave();

    const next = this.states[name];

    if (!next) throw new ReferenceError('missing next state');

    this.state = next;
    this.state.enter();
  }

  update(this: this): void {
    if (!this.state) return;

    this.state.update();
  }
}

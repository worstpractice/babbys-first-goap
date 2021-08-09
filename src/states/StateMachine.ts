import type { State } from '../typings/State';
import type { StateName } from '../typings/StateName';
import type { States } from '../typings/States';

export class StateMachine {
  private readonly states: { [key in StateName]?: State } = {};

  private state: State | null = null;

  add<T extends StateName>(this: this, name: T, state: States[T]): void {
    this.states[name] = state;
  }

  enter<T extends StateName>(this: this, name: T): void {
    if (this.state) this.state.leave();

    const next = this.states[name] as State;

    this.state = next;
    this.state.enter();
  }

  update(this: this): void {
    if (!this.state) return;

    this.state.update();
  }
}

import type { FiniteState } from '../typings/FiniteState';
import type { FiniteStateName } from '../typings/FiniteStateName';
import type { FiniteStates } from '../typings/FiniteStates';
import type { Table } from '../typings/Table';

export class FiniteStateMachine {
  private readonly states = {} as Table<FiniteStateName, FiniteState>;

  private state: FiniteState | null = null;

  add<T extends FiniteStateName>(this: this, name: T, state: FiniteStates[T]): void {
    this.states[name] = state;
  }

  enter<T extends FiniteStateName>(this: this, name: T): void {
    if (this.state) this.state.leave();

    const nextState = this.states[name] as FiniteState;

    this.state = nextState;
    this.state.enter();
  }

  update(this: this): void {
    if (!this.state) return;

    this.state.update();
  }
}

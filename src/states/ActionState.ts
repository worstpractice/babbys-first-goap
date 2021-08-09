import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';
import type { BaseState } from '../typings/State';

export class ActionState implements BaseState {
  private readonly entity: Agent;

  private isWaiting = false;

  private lastAction: Action | null = null;

  private isTimeoutSet = false;

  constructor(entity: Agent) {
    this.entity = entity;
  }

  enter(this: this): void {
    console.debug(`${this.entity.name} enters ${this.constructor.name}`);
  }

  leave(this: this): void {
    console.debug(`${this.entity.name} leaves ${this.constructor.name}`);
  }

  update(this: this): void {
    const action = this.isWaiting ? null : this.entity.currentPlan.shift() ?? null;

    if (!(action || this.lastAction)) return;

    this.isWaiting = true;
    this.lastAction = action ?? this.lastAction;

    const safeAction = this.lastAction as Action;

    if (!safeAction?.canExecute()) return;

    const cost = safeAction.cost;

    if (this.isTimeoutSet) return;

    this.isTimeoutSet = true;

    // wait, apply and move to the next one (if there is one)
    const t1 = window.setTimeout(() => {
      window.clearTimeout(t1);
      const t2 = window.setTimeout(() => {
        window.clearTimeout(t2);

        safeAction.execute(); // execute action, might break tools or something like this
        this.entity.applyAction(safeAction);

        this.isWaiting = false;
        this.lastAction = null;
        this.isTimeoutSet = false;

        const nextState = this.entity.currentPlan.length ? 'moving' : 'idle';

        this.entity.stateMachine.enter(nextState);
      }, 500 * cost); // 1 cost = 0.5s
    });
  }
}

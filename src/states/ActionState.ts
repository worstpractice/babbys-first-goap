import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';

export class ActionState {
  entity: Agent;

  isWaiting = false;

  lastAction: Action | null = null;

  isTimeoutSet = false;

  constructor(entity: Agent) {
    this.entity = entity;
  }

  enter() {
    console.debug(`${this.entity.name} enters ${this.constructor.name}`);
  }

  leave() {
    console.debug(`${this.entity.name} leaves ${this.constructor.name}`);
  }

  update() {
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
    window.setTimeout(() => {
      safeAction.execute(); // execute action, might break tools or something like this
      this.entity.applyAction(safeAction);

      this.isWaiting = false;
      this.lastAction = null;
      this.isTimeoutSet = false;

      if (this.entity.currentPlan.length) {
        this.entity.stateMachine.enter('moving');
      } else {
        this.entity.stateMachine.enter('idle');
      }
    }, 500 * cost); // 1 cost = 0.5s
  }
}

import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';
import type { State } from '../typings/State';

export class ActionState implements State {
  private readonly agent: Agent;

  private isWaiting = false;

  private lastAction: Action | null = null;

  private isTimeoutSet = false;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  enter(this: this): void {
    console.debug(`${this.agent.name}: action`);
  }

  leave(this: this): void {
    // console.debug(`${this.agent.name} -> stop action`);
  }

  update(this: this): void {
    const action = this.isWaiting ? null : this.agent.currentPlan.shift() ?? null;

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
        this.agent.applyAction(safeAction);

        this.isWaiting = false;
        this.lastAction = null;
        this.isTimeoutSet = false;

        this.agent.becomeIdle();
      }, 500 * cost); // 1 cost = 0.5s
    });
  }
}

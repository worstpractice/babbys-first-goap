import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class ActionState implements FiniteState {
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
    if (this.isWaiting) return;

    const maybeAction = this.agent.proceedWithPlan();

    if (!(maybeAction || this.lastAction)) return;

    this.lastAction = maybeAction ?? this.lastAction;

    const action = this.lastAction as Action;

    if (!action.canExecute()) return;

    if (this.isTimeoutSet) return;

    this.isWaiting = true;

    this.isTimeoutSet = true;

    const cost = action.cost;

    // wait, apply and move to the next one (if there is one)
    window.setTimeout(() => {
      console.log('wont be waiting soon');

      window.setTimeout(() => {
        action.execute(); // execute action, might break tools or something like this
        this.agent.applyAction(action);

        console.log('is no longer waiting');

        this.isWaiting = false;
        this.lastAction = null;
        this.isTimeoutSet = false;

        this.agent.becomeIdle();
      }, 500 * cost); // 1 cost = 0.5s
    });
  }
}

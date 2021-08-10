import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class Interacting implements FiniteState {
  private isWaiting = false;

  private lastAction: Action | null = null;

  private isTimeoutSet = false;

  update(this: this, agent: Agent): void {
    if (this.isWaiting) return;
    if (this.isTimeoutSet) return;

    const nextAction = agent.proceedWithPlan();

    if (!nextAction && !this.lastAction) return;

    this.lastAction = nextAction ?? this.lastAction;

    const action = this.lastAction as Action;

    this.isWaiting = true;

    this.isTimeoutSet = true;

    // wait, apply and move to the next one (if there is one)

    const performAction = (): void => {
      this.isWaiting = false;
      this.lastAction = null;
      this.isTimeoutSet = false;

      if (action.canExecute()) {
        action.execute(); // execute action, might break tools or something like this
        agent.applyAction(action);
      } else {
        agent.plan();
      }

      agent.transitionTo('idle');
    };

    const kickOffTimer = (): void => {
      const costInMs = action.cost * 500; // 1 cost = 0.5s;

      window.setTimeout(performAction, costInMs);
    };

    window.setTimeout(kickOffTimer);
  }
}

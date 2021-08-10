import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class Interacting implements FiniteState {
  private isWaiting = false;

  private isTimeoutSet = false;

  update(this: this, agent: Agent): void {
    if (this.isWaiting) return;
    if (this.isTimeoutSet) return;

    const nextAction = agent.proceedWithPlan();

    if (!nextAction) return;

    this.isWaiting = true;

    this.isTimeoutSet = true;

    const performAction = (): void => {
      this.isWaiting = false;
      this.isTimeoutSet = false;

      if (nextAction.canExecute()) {
        nextAction.execute();
        agent.applyAction(nextAction);
      } else {
        agent.makePlan();
      }

      agent.transitionTo('idling');
    };

    const kickOffTimer = (): void => {
      const costInMs = nextAction.cost * 500; // 1 cost = 0.5s;

      window.setTimeout(performAction, costInMs);
    };

    window.setTimeout(kickOffTimer);
  }
}

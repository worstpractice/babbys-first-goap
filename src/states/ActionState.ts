import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class ActionState implements FiniteState {
  private readonly agent: Agent;

  private isWaiting = false;

  private lastAction: Action | null = null;

  private isTimeoutSet = false;

  private timerHandle = -1;

  private currentAction: Action | null = null;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  enter(this: this): void {
    console.debug(`${this.agent.name}: action`);
  }

  leave(this: this): void {
    // console.debug(`${this.agent.name} -> stop action`);
  }

  private readonly kickOffTimer = (costInMs: number): void => {
    window.clearTimeout(this.timerHandle);

    this.timerHandle = window.setTimeout(this.performAction, costInMs);
  };

  private readonly performAction = (): void => {
    this.isWaiting = false;
    this.lastAction = null;
    this.isTimeoutSet = false;

    if (this.currentAction?.canExecute()) {
      this.currentAction.execute(); // execute action, might break tools or something like this
      this.agent.applyAction(this.currentAction);
    } else {
      this.agent.plan();
    }

    this.agent.becomeIdle();
  };

  update(this: this): void {
    if (this.isWaiting) return;

    if (this.isTimeoutSet) return;

    const nextAction = this.agent.proceedWithPlan();

    if (!nextAction && !this.lastAction) return;

    this.lastAction = nextAction ?? this.lastAction;

    this.currentAction = this.lastAction as Action;

    this.isWaiting = true;

    this.isTimeoutSet = true;

    const costInMs = this.currentAction.cost * 500; // 1 cost = 0.5s;

    // wait, apply and move to the next one (if there is one)

    this.kickOffTimer(costInMs);

    // const t1 = window.setTimeout(() => {
    //   window.clearTimeout(t1);

    //   const t2 = window.setTimeout(() => {
    //     window.clearTimeout(t2);

    //     this.isWaiting = false;
    //     this.lastAction = null;
    //     this.isTimeoutSet = false;

    //     if (this.currentAction.canExecute()) {
    //       this.currentAction.execute(); // execute action, might break tools or something like this
    //       this.agent.applyAction(action);
    //     } else {
    //       this.agent.plan();
    //     }

    //     this.agent.becomeIdle();
    //   }, 500 * cost); // 1 cost = 0.5s
    // });
  }
}

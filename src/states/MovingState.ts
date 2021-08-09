import type { Agent } from '../ai/Agent';
import type { State } from '../typings/State';

export class MovingState implements State {
  private readonly agent: Agent;

  constructor(entity: Agent) {
    this.agent = entity;
  }

  enter(this: this): void {
    console.debug(`${this.agent.name}: moving`);

    this.agent.target = this.agent.currentPlan[0]?.position ?? null;
  }

  leave(this: this): void {
    // console.debug(`${this.agent.name} -> stop moving`);
  }

  update(this: this): void {
    const hasArrived = this.agent.moveToTarget();

    if (!hasArrived) return;

    this.agent.takeAction();
  }
}

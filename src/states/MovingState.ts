import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class MovingState implements FiniteState {
  private readonly agent: Agent;

  constructor(entity: Agent) {
    this.agent = entity;
  }

  enter(this: this): void {
    console.debug(`${this.agent.name}: moving`);
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

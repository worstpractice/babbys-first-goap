import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class IdleState implements FiniteState {
  private readonly agent: Agent;

  constructor(entity: Agent) {
    this.agent = entity;
  }

  enter(this: this): void {
    console.debug(`${this.agent.name}: idle`);
  }

  leave(this: this): void {
    // console.debug(`${this.agent.name} -> stop idling`);
  }

  update(this: this): void {
    if (this.agent.name === 'blacksmith') {
      console.log(this.agent.currentPlan.at(-1));
    }

    if (this.agent.isOutOfIdeas()) return;

    // if (!this.agent.currentTarget) this.agent.updateTarget();

    this.agent.startMoving();
  }
}

import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class Idling implements FiniteState {
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
    if (this.agent.currentPlan.length) return;

    this.agent.transitionTo('moving');
  }
}
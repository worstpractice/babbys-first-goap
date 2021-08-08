import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';

export class IdleState {
  entity: Agent;

  constructor(entity: Agent) {
    this.entity = entity;
  }

  enter(this: this) {
    console.debug(`${this.entity.name} enters ${this.constructor.name}`);
  }

  leave(this: this) {
    console.debug(`${this.entity.name} leaves ${this.constructor.name}`);
  }

  update(this: this) {
    const plan = this.entity.plan();

    if (!plan.length) return;

    this.entity.currentPlan = plan as Action[];
    this.entity.stateMachine.enter('moving');
  }
}

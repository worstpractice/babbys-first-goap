import type { Action } from '../actions/Action';
import type { Agent } from '../ai/Agent';
import type { BaseState } from '../typings/State';

export class IdleState implements BaseState {
  private readonly entity: Agent;

  constructor(entity: Agent) {
    this.entity = entity;
  }

  enter(this: this): void {
    console.debug(`${this.entity.name} enters ${this.constructor.name}`);
  }

  leave(this: this): void {
    console.debug(`${this.entity.name} leaves ${this.constructor.name}`);
  }

  update(this: this): void {
    const plan = this.entity.plan();

    if (!plan.length) return;

    this.entity.currentPlan = plan as Action[];
    this.entity.stateMachine.enter('moving');
  }
}

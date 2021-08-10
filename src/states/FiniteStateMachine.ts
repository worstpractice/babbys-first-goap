import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';
import type { FiniteStateName } from '../typings/FiniteStateName';
import { Idling } from './Idling';
import { Interacting } from './Interacting';
import { MovingState } from './Moving';

export class FiniteStateMachine {
  private readonly agent: Agent;

  private currentState: FiniteState;

  private readonly states: { readonly [key in FiniteStateName]: FiniteState } = {
    action: new Interacting(),
    idle: new Idling(),
    moving: new MovingState(),
  };

  constructor(agent: Agent) {
    this.agent = agent;
    this.currentState = this.states['idle'];
  }

  transitionTo<T extends FiniteStateName>(this: this, nextState: T): void {
    this.currentState = this.states[nextState];
  }

  update(this: this): void {
    this.currentState.update(this.agent);
  }
}

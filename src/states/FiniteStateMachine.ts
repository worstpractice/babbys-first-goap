import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';
import type { FiniteStateName } from '../typings/FiniteStateName';
import { Idling } from './Idling';
import { Interacting } from './Interacting';
import { Moving } from './Moving';

export class FiniteStateMachine {
  private readonly agent: Agent;

  private currentState: FiniteState;

  private readonly idling: FiniteState = new Idling();

  private readonly interacting: FiniteState = new Interacting();

  private readonly moving: FiniteState = new Moving();

  constructor(agent: Agent) {
    this.agent = agent;
    this.currentState = this.idling;
  }

  transitionTo(this: this, nextState: FiniteStateName): void {
    this.currentState = this[nextState];
  }

  update(this: this): void {
    this.currentState.update(this.agent);
  }
}

import type { Agent } from 'src/ai/Agent';
import { Idling } from 'src/states/Idling';
import { Interacting } from 'src/states/Interacting';
import { Moving } from 'src/states/Moving';
import type { FiniteState } from 'src/typings/FiniteState';
import type { FiniteStateName } from 'src/typings/names/FiniteStateName';

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

  transitionTo(this: this, name: FiniteStateName): void {
    this.currentState = this[name];
  }

  update(this: this): void {
    this.currentState.update(this.agent);
  }
}

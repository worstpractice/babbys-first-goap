import type { Agent } from 'src/ai/Agent';
import type { FiniteState } from 'src/typings/FiniteState';

export class Idling implements FiniteState {
  update(this: this, agent: Agent): void {
    if (!agent.plan.length) return;

    agent.transitionTo('moving');
  }
}

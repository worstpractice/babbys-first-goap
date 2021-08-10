import type { Agent } from '../ai/Agent';
import type { FiniteState } from '../typings/FiniteState';

export class MovingState implements FiniteState {
  update(this: this, agent: Agent): void {
    const hasArrived = agent.moveToTarget();

    if (!hasArrived) return;

    agent.transitionTo('interacting');
  }
}

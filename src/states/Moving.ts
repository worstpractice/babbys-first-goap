import type { Agent } from 'src/ai/Agent';
import type { FiniteState } from 'src/typings/FiniteState';

export class Moving implements FiniteState {
  update(this: this, agent: Agent): void {
    const hasArrived = agent.moveToTarget();

    if (!hasArrived) return;

    agent.transitionTo('interacting');
  }
}

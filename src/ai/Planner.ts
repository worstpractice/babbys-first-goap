import type { Action } from '../actions/Action';
import type { Fact } from '../typings/Fact';
import type { Facts } from '../typings/Facts';
import { byCost } from '../utils/byCost';
import { entries } from '../utils/entries';
import { exclude } from '../utils/exclude';
import { fromEntries } from '../utils/fromEntries';
import type { Agent } from './Agent';
import { GraphNode } from './GraphNode';

export class Planner {
  plan(this: this, agent: Agent, goal: Fact): readonly Action[] {
    const root = new GraphNode(null, null, 0, agent.state);

    const leaves: GraphNode[] = [];

    this.buildGraph(root, leaves, agent.actions, goal);

    leaves.sort(byCost);

    if (!leaves.length) throw new RangeError('no leaves!');

    const plan = this.traverseGraphFrom(leaves);

    if (!plan.length) throw new RangeError('no plan!');

    return plan;
  }

  private traverseGraphFrom(this: this, leaves: readonly GraphNode[]): readonly Action[] {
    const cheapest: GraphNode | null = leaves[0] ?? null;

    const plan: Action[] = [];

    let node: GraphNode | null = cheapest;

    while (node) {
      if (node.action) plan.unshift(node.action);

      node = node.parent;
    }

    return plan;
  }

  /** NOTE: gross side-effect. Mutates `leaves`. */
  private buildGraph(this: this, parent: GraphNode, leaves: GraphNode[], actions: readonly Action[], goal: Fact): void {
    for (const action of actions) {
      if (!this.arePreconditionsMet(parent.state, action.preconditions)) continue;

      const currentState = this.applyState(parent.state, action.effects);

      const node = new GraphNode(parent, action, parent.cost + action.cost, currentState);

      const isGoalMet = currentState[goal.name] === goal.value;

      if (isGoalMet) {
        leaves.push(node);
        continue;
      }

      const remainingActions = actions.filter(exclude(action));

      this.buildGraph(node, leaves, remainingActions, goal);
    }
  }

  private arePreconditionsMet(this: this, state: Facts, preconditions: Facts): boolean {
    for (const [name, value] of entries(preconditions)) {
      if (!state[name] === value) return false;
    }

    return true;
  }

  private applyState(this: this, old: Facts, newState: Facts): Facts {
    return fromEntries([...entries(old), ...entries(newState)] as const);
  }
}

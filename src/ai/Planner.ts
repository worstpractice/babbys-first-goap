import type { Action } from '../actions/Action';
import type { Fact } from '../typings/Fact';
import type { Facts } from '../typings/Facts';
import type { GraphNode } from '../typings/GraphNode';
import { byCost } from '../utils/byCost';
import { entries } from '../utils/entries';
import { exclude } from '../utils/exclude';
import type { Agent } from './Agent';

export class Planner {
  plan(this: this, agent: Agent, goal: Fact): readonly Action[] {
    const root: GraphNode = {
      action: null,
      cost: 0,
      parent: null,
      state: agent.state,
    } as const;

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

      const currentFacts: Facts = { ...parent.state, ...action.effects } as const;

      const node: GraphNode = {
        action,
        cost: parent.cost + action.cost,
        parent,
        state: currentFacts,
      } as const;

      const isGoalMet = currentFacts[goal.name] === goal.value;

      if (isGoalMet) {
        leaves.push(node);
        continue;
      }

      const remainingActions: readonly Action[] = actions.filter(exclude(action));

      this.buildGraph(node, leaves, remainingActions, goal);
    }
  }

  private arePreconditionsMet(this: this, state: Facts, preconditions: Facts): boolean {
    for (const [name, value] of entries(preconditions)) {
      if (!state[name] === value) return false;
    }

    return true;
  }
}

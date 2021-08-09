import type { Action } from '../actions/Action';
import type { Goal } from '../typings/Fact';
import type { Facts } from '../typings/Facts';
import type { GraphNode } from '../typings/GraphNode';
import { byCost } from '../utils/byCost';
import { entries } from '../utils/entries';
import { exclude } from '../utils/exclude';
import type { Agent } from './Agent';

export class Planner {
  readonly graph: GraphNode[] = [];

  resetGraph(this: this): void {
    this.graph.length = 0;
  }

  devisePlan(this: this, agent: Agent): void {
    this.resetGraph();

    const root: GraphNode = {
      action: null,
      cost: 0,
      facts: agent.facts,
      parent: null,
    } as const;

    this.buildGraph(root, this.graph, agent.actions, agent.goal);

    this.graph.sort(byCost);

    this.traverseGraph(this.graph, agent.currentPlan);
  }

  /** NOTE: gross side-effect. Mutates `leaves`. */
  private buildGraph(this: this, parent: GraphNode, leaves: GraphNode[], actions: readonly Action[], goal: Goal): void {
    for (const action of actions) {
      if (!this.arePreconditionsMet(parent.facts, action.before)) continue;

      const currentFacts = { ...parent.facts, ...action.after };

      const node: GraphNode = {
        action,
        cost: parent.cost + action.cost,
        facts: currentFacts,
        parent,
      } as const;

      const isGoalMet = currentFacts[goal.name] === goal.value;

      if (isGoalMet) {
        leaves.push(node);
        continue;
      }

      const remainingActions = actions.filter(exclude(action));

      this.buildGraph(node, leaves, remainingActions, goal);
    }
  }

  private traverseGraph(this: this, leaves: readonly GraphNode[], plan: Action[]): void {
    const cheapest: GraphNode | null = leaves[0] ?? null;

    let node: GraphNode | null = cheapest;

    while (node) {
      if (node.action) plan.unshift(node.action);

      node = node.parent;
    }
  }

  private arePreconditionsMet(this: this, facts: Facts, preconditions: Facts): boolean {
    for (const [key, value] of entries(preconditions)) {
      if (facts[key] !== value) return false;
    }

    return true;
  }
}

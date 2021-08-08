import type { Agent } from './Agent';
import type { Fact } from '../typings/Fact';
import type { FactName } from '../typings/GoalName';
import type { State } from '../typings/State';
import { byCost } from '../utils/byCost';
import { exclude } from '../utils/exclude';
import type { Action } from '../actions/Action';
import { GraphNode } from './GraphNode';

export class Planner {
  plan(this: this, agent: Agent, goal: Fact): readonly Action[] {
    const root = new GraphNode(null, null, 0, agent.state);

    const mutableLeaves: GraphNode[] = [];

    const leaves = this.#buildGraph(root, mutableLeaves, agent.actions, goal).sort(byCost) as readonly GraphNode[];

    if (!leaves.length) throw new RangeError('no leaves!');

    const plan = this.#traverseGraphFrom(leaves);

    if (!plan.length) throw new RangeError('no plan!');

    return plan;
  }

  #traverseGraphFrom(this: this, leaves: readonly GraphNode[]): readonly Action[] {
    const cheapest: GraphNode | null = leaves[0] ?? null;

    const plan: Action[] = [];

    let node: GraphNode | null = cheapest;

    while (node) {
      if (node.action) plan.unshift(node.action);

      node = node.parent;
    }

    return plan;
  }

  #buildGraph(this: this, parent: GraphNode, leaves: GraphNode[], actions: readonly Action[], goal: Fact): GraphNode[] {
    for (const action of actions) {
      if (!this.arePreconditionsMet(parent.state, action.preconditions)) continue;

      const currentState = this.#applyState(parent.state, action.effects);

      const node = new GraphNode(parent, action, parent.cost + action.cost, currentState);

      const isGoalMet = currentState[goal.name] === goal.value;

      if (isGoalMet) {
        leaves.push(node);
        continue;
      }

      const remainingActions = actions.filter(exclude(action));

      this.#buildGraph(node, leaves, remainingActions, goal);
    }

    return leaves;
  }

  arePreconditionsMet(this: this, state: State, preconditions: State): boolean {
    const entries = Object.entries(preconditions) as readonly (readonly [FactName, boolean])[];

    for (const [name, value] of entries) {
      if (!state[name] === value) return false;
    }

    return true;
  }

  #applyState(this: this, old: State, newState: State): State {
    return Object.fromEntries([...Object.entries(old), ...Object.entries(newState)] as const);
  }
}

import type { Action } from '../actions/Action';
import type { Goal } from '../typings/Fact';
import type { GraphNode } from '../typings/GraphNode';
import type { Facts } from '../typings/tables/Facts';
import { exclude } from '../utils/arrays/filtering/exclude';
import { byCostDescending } from '../utils/arrays/sorting/mostExpensiveFirst';

const warn = (reason: string, actions: readonly Action[], facts: Facts, goal: Goal): void => {
  console.group();
  console.warn(reason);
  console.warn(`Goal "${goal.name}: ${goal.value}" is unreachable!`);
  console.warn('Current facts', facts);
  console.warn('Available actions', actions);
  console.groupEnd();
};

const baseGraphOn = (facts: Facts): GraphNode => {
  return {
    action: null,
    cost: 0,
    facts,
    parent: null,
  } as const;
};

const pathfind = (parent: GraphNode, actions: readonly Action[], goal: Goal): GraphNode[] => {
  const leaves: GraphNode[] = [];

  for (const action of actions) {
    if (!arePreconditionsMet(parent.facts, action.before)) continue;

    const currentFacts = { ...parent.facts, ...action.after };

    const node: GraphNode = {
      action,
      cost: parent.cost + action.cost,
      facts: currentFacts,
      parent,
    } as const;

    const meetsGoal = currentFacts[goal.name] === goal.value;

    if (meetsGoal) {
      leaves.push(node);
      continue;
    }

    const remainingActions = actions.filter(exclude(action));

    for (const leaf of pathfind(node, remainingActions, goal)) {
      leaves.push(leaf);
    }
  }

  return leaves;
};

const traverseGraph = (path: GraphNode[]): Action[] => {
  const plan: Action[] = [];

  const cheapest: GraphNode | null = path.sort(byCostDescending).pop() ?? null;

  let node: GraphNode | null = cheapest;

  while (node) {
    if (node.action) plan.push(node.action);

    node = node.parent;
  }

  return plan;
};

const arePreconditionsMet = (facts: Facts, preconditions: Facts): boolean => {
  for (const [key, value] of Object.entries(preconditions)) {
    if (facts[key] !== value) return false;
  }

  return true;
};

/////////////////////////////////////////////////////////////////////////////////////////////
// * Public *
/////////////////////////////////////////////////////////////////////////////////////////////
export const makePlan = (actions: readonly Action[], facts: Facts, goal: Goal): readonly Action[] => {
  const root: GraphNode = baseGraphOn(facts);

  const path: GraphNode[] = pathfind(root, actions, goal);

  if (!path.length) warn('No path could be found!', actions, facts, goal);

  const plan: Action[] = traverseGraph(path);

  if (!plan.length) warn('No plan could be made!', actions, facts, goal);

  return plan;
};

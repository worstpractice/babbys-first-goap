import type { Action } from 'src/actions/Action';
import type { Goal } from 'src/typings/Fact';
import type { GraphNode } from 'src/typings/GraphNode';
import type { Facts } from 'src/typings/tables/Facts';
import { canExecute } from 'src/utils/arePreconditionsMet';
import { exclude } from 'src/utils/filtering/exclude';
import { byCostDescending } from 'src/utils/sorting/byCostDescending';

const warn = (reason: string, actions: readonly Action[], facts: Facts, goal: Goal): void => {
  console.group();
  console.warn(reason);
  console.warn(`Goal "${goal.name}: ${goal.value}" is unreachable!`);
  console.warn('Current facts', facts);
  console.warn('Available actions', actions);
  console.groupEnd();
  debugger; // eslint-disable-line no-debugger
};

const pathfind = (parent: GraphNode, actions: readonly Action[], goal: Goal): GraphNode[] => {
  const leaves: GraphNode[] = [];

  for (const action of actions) {
    if (!canExecute(parent, action)) continue;

    const currentFacts: Facts = { ...parent.facts, ...action.after };

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

/////////////////////////////////////////////////////////////////////////////////////////////
// * Public *
/////////////////////////////////////////////////////////////////////////////////////////////
export const makePlan = (actions: readonly Action[], facts: Facts, goal: Goal): readonly Action[] => {
  const root: GraphNode = {
    action: null,
    cost: 0,
    facts,
    parent: null,
  } as const;

  const path: GraphNode[] = pathfind(root, actions, goal);

  if (!path.length) warn('No path could be found!', actions, facts, goal);

  const plan: Action[] = traverseGraph(path);

  if (!plan.length) warn('No plan could be made!', actions, facts, goal);

  return plan;
};

import type { Action } from 'src/actions/Action';
import type { GraphNode } from 'src/typings/GraphNode';
import type { ResourceName } from 'src/typings/names/ResourceName';
import { arePreconditionsMetBy } from 'src/utils/arePreconditionsMetBy';
import { exclude } from 'src/utils/filtering/exclude';
import { byCostDescending } from 'src/utils/sorting/byCostDescending';

const warn = (reason: string, actions: readonly Action[], facts: Set<ResourceName>, goal: ResourceName): void => {
  console.group();
  console.warn(reason);
  console.warn(`Goal "${goal}" is unreachable!`);
  console.warn('Current facts', facts);
  console.warn('Available actions', actions);
  console.groupEnd();
  debugger; // eslint-disable-line no-debugger
};

const pathfind = (parent: GraphNode, actions: readonly Action[], goal: ResourceName): GraphNode[] => {
  const leaves: GraphNode[] = [];

  for (const action of actions) {
    if (!arePreconditionsMetBy(parent, action)) continue;

    const { gains, loses } = action.after;

    const currentFacts: Set<ResourceName> = new Set<ResourceName>([...parent.facts, ...gains] as const);

    for (const lost of loses) {
      currentFacts.delete(lost);
    }

    const node: GraphNode = {
      action,
      cost: parent.cost + action.cost,
      facts: currentFacts,
      parent,
    } as const;

    const meetsGoal = currentFacts.has(goal);

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
export const makePlan = (actions: readonly Action[], facts: Set<ResourceName>, goal: ResourceName): readonly Action[] => {
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

import { ObSet } from 'obset';
import type { Action } from 'src/entities/Action';
import type { GraphNode } from 'src/typings/GraphNode';
import type { ResourceName } from 'src/typings/names/ResourceName';
import { arePreconditionsMetBy } from 'src/utils/arePreconditionsMetBy';
import { exclude } from 'src/utils/filtering/exclude';

export const pathfind = (parent: GraphNode, actions: readonly Action[], goal: ResourceName): GraphNode[] => {
  const leaves: GraphNode[] = [];

  for (const action of actions) {
    if (!arePreconditionsMetBy(parent, action)) continue;

    const { gains, loses } = action.after;

    const currentFacts: ObSet<ResourceName> = new ObSet<ResourceName>([...parent.facts, ...gains] as const);

    for (const lost of loses) {
      currentFacts.delete(lost);
    }

    const node: GraphNode = {
      action,
      cost: parent.cost + action.cost,
      facts: currentFacts,
      parent,
    } as const;

    const isLeadingTowardsGoal = currentFacts.has(goal);

    if (isLeadingTowardsGoal) {
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

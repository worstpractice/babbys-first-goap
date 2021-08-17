import type { Action } from 'src/entities/Action';
import { pathfind } from 'src/planning/pathfind';
import { traverseGraph } from 'src/planning/traverseGraph';
import { warn } from 'src/planning/warn';
import type { GraphNode } from 'src/typings/GraphNode';
import type { ResourceName } from 'src/typings/names/ResourceName';

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

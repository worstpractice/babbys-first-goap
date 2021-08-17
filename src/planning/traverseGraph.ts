import type { Action } from 'src/entities/Action';
import type { GraphNode } from 'src/typings/GraphNode';
import { byCostDescending } from 'src/utils/sorting/byCostDescending';

export const traverseGraph = (path: GraphNode[]): Action[] => {
  const plan: Action[] = [];

  const cheapest: GraphNode | null = path.sort(byCostDescending).pop() ?? null;

  let node: GraphNode | null = cheapest;

  while (node) {
    if (node.action) plan.push(node.action);

    node = node.parent;
  }

  return plan;
};

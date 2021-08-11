import type { Action } from 'src/actions/Action';
import type { Agent } from 'src/ai/Agent';
import type { GraphNode } from 'src/typings/GraphNode';

export const canExecute = <T extends Agent | GraphNode>({ facts }: T, { before }: Action): boolean => {
  for (const [key, value] of Object.entries(before)) {
    if (facts[key] !== value) return false;
  }

  return true;
};

import type { Action } from 'src/actions/Action';
import type { Agent } from 'src/ai/Agent';
import type { GraphNode } from 'src/typings/GraphNode';

export const arePreconditionsMetBy = <T extends Agent | GraphNode>({ facts }: T, { before }: Action): boolean => {
  const { has, lacks } = before;

  for (const required of has) {
    if (!facts.has(required)) return false;
  }

  for (const forbidden of lacks) {
    if (facts.has(forbidden)) return false;
  }

  return true;
};

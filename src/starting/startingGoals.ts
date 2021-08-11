import type { AgentName } from 'src/typings/names/AgentName';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Table } from 'src/typings/Table';

export const startingGoals: Table<AgentName, ResourceName> = {
  blacksmith: 'pickaxe',
  miner: 'ore',
} as const;

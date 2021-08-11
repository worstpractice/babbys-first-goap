import type { Goal } from 'src/typings/Fact';
import type { AgentName } from 'src/typings/names/AgentName';
import type { Table } from 'src/typings/Table';

export const startingGoals: Table<AgentName, Goal> = {
  blacksmith: {
    name: 'has_pickaxe',
    value: true,
  },
  miner: {
    name: 'has_ore',
    value: true,
  },
} as const;

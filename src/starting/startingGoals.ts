import type { AgentName } from 'typings/names/AgentName';
import type { Table } from 'typings/Table';
import type { Goal } from '../typings/Fact';

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

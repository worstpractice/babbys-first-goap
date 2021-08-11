import type { AgentName } from 'src/typings/names/AgentName';
import type { StationName } from 'src/typings/names/StationName';
import type { Position } from 'src/typings/Position';

export const startingPositions: { readonly [key in AgentName | StationName]: Position } = {
  blacksmith: {
    x: 300,
    y: 200,
  },

  forge: {
    x: 100,
    y: 300,
  },

  miner: {
    x: 300,
    y: 300,
  },

  ore_deposit: {
    x: 100,
    y: 600,
  },

  pickaxe_deposit: {
    x: 800,
    y: 200,
  },

  vein: {
    x: 800,
    y: 600,
  },
} as const;

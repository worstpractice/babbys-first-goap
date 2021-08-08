import type { State } from '../typings/State';
import type { Action } from '../actions/Action';

export class GraphNode {
  readonly action: Action | null;

  readonly cost: number;

  readonly parent: GraphNode | null;

  readonly state: State;

  constructor(parent: GraphNode | null, action: Action | null, cost: number, state: State) {
    this.action = action;
    this.cost = cost;
    this.parent = parent;
    this.state = state;
  }
}

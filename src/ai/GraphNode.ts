import type { Facts } from '../typings/Facts';
import type { Action } from '../actions/Action';

export class GraphNode {
  readonly action: Action | null;

  readonly cost: number;

  readonly parent: GraphNode | null;

  readonly state: Facts;

  constructor(parent: GraphNode | null, action: Action | null, cost: number, state: Facts) {
    this.action = action;
    this.cost = cost;
    this.parent = parent;
    this.state = state;
  }
}

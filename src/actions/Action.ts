import type { Agent } from '../ai/Agent';
import type { ActionName } from "../typings/ActionName";
import type { FactName } from '../typings/GoalName';
import type { Position } from '../typings/Position';
import type { State } from '../typings/State';

export class Action {
  readonly name: string;

  agent: Agent;

  readonly effects: State = {};

  readonly preconditions: State = {};

  readonly cost: number;

  readonly position: Position;

  constructor(name: ActionName, cost: number, position: Position, agent: Agent) {
    this.name = name;
    this.cost = cost;
    this.position = position;
    this.agent = agent;
  }

  addEffect(this: this, name: FactName, value: boolean): void {
    this.effects[name] = value;
  }

  addPrecondition(this: this, name: FactName, value: boolean): void {
    this.preconditions[name] = value;
  }

  execute(this: this): void {
    console.warn(`${this.name}: You might want to override execute for me :P`);
  }

  canExecute(this: this): boolean {
    return true;
  }
}

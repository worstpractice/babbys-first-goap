import type { GameObjects } from 'phaser';
import type { Action } from '../actions/Action';
import { ActionState } from '../states/ActionState';
import { IdleState } from '../states/IdleState';
import { MovingState } from '../states/MovingState';
import { StateMachine } from '../states/StateMachine';
import type { ActionName } from '../typings/ActionName';
import type { DerivedAction } from '../typings/DerivedAction';
import type { Fact } from '../typings/Fact';
import type { FactName } from '../typings/GoalName';
import type { Position } from '../typings/Position';
import type { State } from '../typings/State';
import { Planner } from './Planner';

export class Agent {
  readonly actions: Action[] = [];

  currentPlan: Action[] = [];

  readonly currentActions: Action[] = [];

  readonly goal: Fact;

  readonly initialPosition: Position;

  readonly name: string;

  readonly sprite: GameObjects.Sprite;

  readonly state: State = {};

  readonly stateMachine = new StateMachine();

  target: Position | null = null;

  constructor(
    name: string,
    sprite: GameObjects.Sprite,
    initialPosition: Position,
    initialGoal: Fact,
    initialState: State,
    derivedActions: readonly (readonly [ActionName, DerivedAction, Position])[],
  ) {
    this.name = name;
    this.sprite = sprite;
    this.initialPosition = initialPosition;
    this.goal = initialGoal;
    this.state = initialState;

    for (const [name, DerivedAction, position] of derivedActions) {
      this.addAction(new DerivedAction(name, position, this));
    }

    this.stateMachine.add('idle', new IdleState(this));
    this.stateMachine.add('moving', new MovingState(this));
    this.stateMachine.add('action', new ActionState(this));

    this.stateMachine.enter('idle');
  }

  update(this: this): void {
    this.stateMachine.update();
  }

  plan(this: this): readonly Action[] {
    const planner = new Planner();

    const plan = planner.plan(this, this.goal);

    return plan;
  }

  addAction(this: this, action: Action): void {
    action.agent = this;

    this.actions.push(action);
  }

  applyAction({ effects }: Action): void {
    const entries = Object.entries(effects) as readonly (readonly [FactName, boolean])[];

    for (const [name, value] of entries) {
      this.setState(name, Boolean(value));
    }
  }

  setState(name: FactName, value: boolean): void {
    this.state[name] = value;
  }

  is(name: FactName, value: boolean): boolean {
    return this.state[name] === value;
  }

  static #isActionReady(action: Action) {
    return action.canExecute();
  }

  // get all actions with cleared preconditions
  getUsableActions() {
    return this.actions.filter(Agent.#isActionReady);
  }
}

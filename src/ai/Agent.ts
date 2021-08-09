import type { GameObjects } from 'phaser';
import type { Action } from '../actions/Action';
import { ActionState } from '../states/ActionState';
import { IdleState } from '../states/IdleState';
import { MovingState } from '../states/MovingState';
import { StateMachine } from '../states/StateMachine';
import type { ActionName } from '../typings/ActionName';
import type { DerivedAction } from '../typings/DerivedAction';
import type { Fact } from '../typings/Fact';
import type { Facts } from '../typings/Facts';
import type { FactName } from '../typings/GoalName';
import type { Position } from '../typings/Position';
import { entries } from '../utils/entries';
import { Planner } from './Planner';

type Props = {
  readonly name: string;
  readonly sprite: GameObjects.Sprite;
  readonly initialGoal: Fact;
  readonly initialState: Facts;
  readonly derivedActions: readonly (readonly [ActionName, DerivedAction, Position])[];
};

export class Agent {
  readonly actions: Action[] = [];

  currentPlan: Action[] = [];

  private readonly goal: Fact;

  readonly name: string;

  readonly sprite: GameObjects.Sprite;

  readonly state: Facts = {};

  readonly stateMachine = new StateMachine();

  target: Position | null = null;

  constructor({ derivedActions, initialGoal, initialState, name, sprite }: Props) {
    this.name = name;
    this.sprite = sprite;
    this.goal = initialGoal;
    this.state = initialState;

    this.sprite.setDepth(1337);

    for (const [name, DerivedAction, position] of derivedActions) {
      this.actions.push(new DerivedAction(name, position, this));
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

  applyAction({ effects }: Action): void {
    for (const [name, value] of entries(effects)) {
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

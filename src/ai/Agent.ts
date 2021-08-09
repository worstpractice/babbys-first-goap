import type { GameObjects } from 'phaser';
import type { Action } from '../actions/Action';
import { ActionState } from '../states/ActionState';
import { IdleState } from '../states/IdleState';
import { MovingState } from '../states/MovingState';
import type { StateMachine } from '../states/StateMachine';
import type { ActionName } from '../typings/ActionName';
import type { DerivedAction } from '../typings/DerivedAction';
import type { Goal } from '../typings/Fact';
import type { Facts } from '../typings/Facts';
import type { Position } from '../typings/Position';
import type { Predicate } from '../typings/Predicate';
import { distanceBetween } from '../utils/distanceBetween';
import { entries } from '../utils/entries';
import type { Planner } from './Planner';

type Props = {
  readonly derivedActions: readonly (readonly [ActionName, DerivedAction, Position])[];
  readonly initialGoal: Goal;
  readonly initialState: Facts;
  readonly name: string;
  readonly planner: Planner;
  readonly stateMachine: StateMachine;
  readonly sprite: GameObjects.Sprite;
};

export class Agent {
  readonly actions: readonly Action[];

  readonly currentPlan: Action[] = [];

  readonly goal: Goal;

  readonly name: string;

  readonly planner: Planner;

  readonly sprite: GameObjects.Sprite;

  readonly facts: Facts = {
    has_ore: false,
    has_pickaxe: false,
  };

  readonly stateMachine: StateMachine;

  target: Position | null = null;

  constructor({ derivedActions, initialGoal, initialState, name, planner, stateMachine, sprite }: Props) {
    this.actions = derivedActions.map(this.toAction) as readonly Action[];
    this.facts = initialState;
    this.goal = initialGoal;
    this.name = name;
    this.planner = planner;
    this.stateMachine = stateMachine;
    this.sprite = sprite;

    this.sprite.setDepth(1337);

    this.stateMachine.add('idle', new IdleState(this));
    this.stateMachine.add('moving', new MovingState(this));
    this.stateMachine.add('action', new ActionState(this));

    this.becomeIdle();
  }

  private readonly toAction = ([name, DerivedAction, position]: readonly [ActionName, DerivedAction, Position]): Action => {
    return new DerivedAction(name, position, this);
  };

  update(this: this): void {
    this.stateMachine.update();
  }

  takeAction(this: this): void {
    this.stateMachine.enter('action');
  }

  becomeIdle(this: this): void {
    this.stateMachine.enter('idle');
  }

  startMoving(this: this): void {
    this.stateMachine.enter('moving');
  }

  applyAction({ after }: Action): void {
    for (const [name, value] of entries(after)) {
      this.setState(name, value);
    }
  }

  moveToTarget(this: this): boolean {
    if (!this.target) return false;

    const { x: spriteX, y: spriteY } = this.sprite;
    const { x: targetX, y: targetY } = this.target;

    const distance = distanceBetween(spriteX, spriteY, targetX, targetY);

    const horizontal = distanceBetween(spriteX + 1, spriteY, targetX, targetY);
    const changeX = horizontal < distance ? 1 : -1;

    const vertical = distanceBetween(spriteX, spriteY + 1, targetX, targetY);
    const changeY = vertical < distance ? 1 : -1;

    this.sprite.x += changeX;
    this.sprite.y += changeY;

    const hasArrived = distance < 10;

    if (hasArrived) {
      this.target = null;
    }

    return hasArrived;
  }

  setState(name: Predicate, value: boolean): void {
    this.facts[name] = value;
  }

  is(name: Predicate, value: boolean): boolean {
    return this.facts[name] === value;
  }

  private isActionReady(action: Action) {
    return action.canExecute();
  }

  // get all actions with cleared preconditions
  getUsableActions() {
    return this.actions.filter(this.isActionReady);
  }

  private forgetPreviousPlan(this: this): void {
    this.currentPlan.length = 0;
  }

  plan(this: this): void {
    this.forgetPreviousPlan();

    this.planner.devisePlan(this);
  }
}

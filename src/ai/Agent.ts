import type { GameObjects } from 'phaser';
import type { Action } from '../actions/Action';
import type { FiniteStateMachine } from '../states/FiniteStateMachine';
import { Idling } from '../states/Idling';
import { Interacting } from '../states/Interacting';
import { MovingState } from '../states/Moving';
import type { ActionName } from '../typings/ActionName';
import type { AgentName } from '../typings/AgentName';
import type { DerivedAction } from '../typings/DerivedAction';
import type { Goal } from '../typings/Fact';
import type { FiniteStateName } from '../typings/FiniteStateName';
import type { Position } from '../typings/Position';
import type { ResourceName } from '../typings/ResourceName';
import type { Facts } from '../typings/tables/Facts';
import { toPredicate } from '../utils/mapping/toPredicate';
import { distanceBetween } from '../utils/shims/distanceBetween';
import { makePlan } from './makePlan';

type Props = {
  readonly derivedActions: readonly (readonly [ActionName, DerivedAction, Position])[];
  readonly image: GameObjects.Image;
  readonly initialGoal: Goal;
  readonly initialState: Facts;
  readonly name: AgentName;
  readonly stateMachine: FiniteStateMachine;
};

export class Agent {
  readonly availableActions: readonly Action[];

  get currentTarget(): Position | null {
    return this.currentPlan.at(-1)?.position ?? null;
  }

  currentFacts: Facts;

  currentGoal: Goal;

  currentPlan: Action[] = [];

  readonly image: GameObjects.Image;

  readonly name: AgentName;

  readonly stateMachine: FiniteStateMachine;

  constructor({ derivedActions, image, initialGoal, initialState, name, stateMachine }: Props) {
    this.availableActions = derivedActions.map(this.toAction) as readonly Action[];
    this.image = image;
    this.currentFacts = initialState;
    this.currentGoal = initialGoal;
    this.name = name;
    this.stateMachine = stateMachine;

    this.stateMachine.add('idle', new Idling(this));
    this.stateMachine.add('moving', new MovingState(this));
    this.stateMachine.add('action', new Interacting(this));

    this.transitionTo('idle');
  }

  update(this: this): void {
    this.stateMachine.update();
  }

  /** NOTE: passes `this` to `DerivedAction`. */
  private readonly toAction = ([name, DerivedAction, position]: readonly [ActionName, DerivedAction, Position]): Action => {
    return new DerivedAction(name, position, this);
  };

  has<T extends ResourceName>(this: this, name: T): boolean {
    return this.currentFacts[toPredicate(name)];
  }

  transitionTo(this: this, to: FiniteStateName): void {
    this.stateMachine.enter(to);
  }

  proceedWithCurrentPlan(this: this): Action | null {
    return this.currentPlan.pop() ?? null;
  }

  moveToTarget(this: this): boolean {
    if (!this.currentTarget) return false;

    const { x: imageX, y: imageY } = this.image;
    const { x: targetX, y: targetY } = this.currentTarget;

    const distance = distanceBetween(imageX, imageY, targetX, targetY);

    const hasArrived = distance < 10;

    if (!hasArrived) {
      const horizontal = distanceBetween(imageX + 1, imageY, targetX, targetY);
      const changeX = horizontal < distance ? 1 : -1;

      const vertical = distanceBetween(imageX, imageY + 1, targetX, targetY);
      const changeY = vertical < distance ? 1 : -1;

      this.image.x += changeX;
      this.image.y += changeY;
    }

    return hasArrived;
  }

  gains<T extends ResourceName>(this: this, resource: T): void {
    this.currentFacts[toPredicate(resource)] = true;
  }

  loses<T extends ResourceName>(this: this, resource: T): void {
    this.currentFacts[toPredicate(resource)] = false;
  }

  applyAction({ after }: Action): void {
    for (const [name, value] of Object.entries(after)) {
      this.currentFacts[name] = value;
    }
  }

  plan(this: this): void {
    const plan: readonly Action[] = makePlan(this.availableActions, this.currentFacts, this.currentGoal);

    this.currentPlan = plan as Action[];
  }
}

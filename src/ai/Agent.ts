import type { GameObjects } from 'phaser';
import type { Action } from '../actions/Action';
import { FiniteStateMachine } from '../states/FiniteStateMachine';
import type { AgentName } from '../typings/AgentName';
import type { Goal } from '../typings/Fact';
import type { FiniteStateName } from '../typings/FiniteStateName';
import type { LazyAction } from '../typings/LazyAction';
import type { Position } from '../typings/Position';
import type { ResourceName } from '../typings/ResourceName';
import type { Facts } from '../typings/tables/Facts';
import { toPredicate } from '../utils/mapping/toPredicate';
import { distanceBetween } from '../utils/shims/distanceBetween';
import { makePlan } from './makePlan';

type AgentProps = {
  readonly derivedActions: readonly LazyAction[];
  readonly image: GameObjects.Image;
  readonly initialGoal: Goal;
  readonly initialState: Facts;
  readonly name: AgentName;
};

export class Agent {
  readonly availableActions: readonly Action[];

  facts: Facts;

  goal: Goal;

  readonly image: GameObjects.Image;

  readonly name: AgentName;

  plan: Action[] = [];

  readonly stateMachine = new FiniteStateMachine(this);

  get target(): Position | null {
    return this.plan.at(-1)?.position ?? null;
  }

  constructor({ derivedActions, image, initialGoal, initialState, name }: AgentProps) {
    this.availableActions = derivedActions.map(this.toAction) as readonly Action[];
    this.image = image;
    this.facts = initialState;
    this.goal = initialGoal;
    this.name = name;
  }

  update(this: this): void {
    this.stateMachine.update();
  }

  /** NOTE: passes `this` to `DerivedAction`. */
  private readonly toAction = ([DerivedAction, props]: LazyAction): Action => {
    return new DerivedAction({ ...props, agent: this });
  };

  has<T extends ResourceName>(this: this, name: T): boolean {
    return this.facts[toPredicate(name)];
  }

  transitionTo(this: this, to: FiniteStateName): void {
    this.stateMachine.transitionTo(to);
  }

  proceedWithPlan(this: this): Action | null {
    return this.plan.pop() ?? null;
  }

  moveToTarget(this: this): boolean {
    if (!this.target) return false;

    const { x: imageX, y: imageY } = this.image;
    const { x: targetX, y: targetY } = this.target;

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
    this.facts[toPredicate(resource)] = true;
  }

  loses<T extends ResourceName>(this: this, resource: T): void {
    this.facts[toPredicate(resource)] = false;
  }

  applyAction({ after }: Action): void {
    for (const [name, value] of Object.entries(after)) {
      this.facts[name] = value;
    }
  }

  makePlan(this: this): void {
    const plan: readonly Action[] = makePlan(this.availableActions, this.facts, this.goal);

    this.plan = plan as Action[];
  }
}

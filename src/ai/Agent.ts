import type { GameObjects } from 'phaser';
import type { Action } from 'src/actions/Action';
import { makePlan } from 'src/ai/makePlan';
import { FiniteStateMachine } from 'src/states/FiniteStateMachine';
import type { Goal } from 'src/typings/Fact';
import type { LazyAction } from 'src/typings/LazyAction';
import type { AgentName } from 'src/typings/names/AgentName';
import type { FiniteStateName } from 'src/typings/names/FiniteStateName';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Position } from 'src/typings/Position';
import type { Facts } from 'src/typings/tables/Facts';
import { canExecute } from 'src/utils/arePreconditionsMet';
import { counted } from 'src/utils/counted';
import { toPredicate } from 'src/utils/mapping/toPredicate';
import { toResourceName } from 'src/utils/mapping/toResourceName';
import { distanceBetween } from 'src/utils/shims/distanceBetween';

export type AgentProps = {
  readonly derivedActions: readonly LazyAction[];
  readonly image: GameObjects.Image;
  readonly initialGoal: Goal;
  readonly initialFacts: Facts;
  readonly name: AgentName;
};

const DEBUG = false;

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

  constructor({ derivedActions, image, initialFacts, initialGoal, name }: AgentProps) {
    this.availableActions = derivedActions.map(this.toAction) as readonly Action[];
    this.image = image;
    this.facts = initialFacts;
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

  transitionTo(this: this, name: FiniteStateName): void {
    this.stateMachine.transitionTo(name);
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

  attempt(this: this, action: Action): void {
    canExecute(this, action) ? this.execute(action) : this.makePlan();
  }

  private execute(this: this, action: Action): void {
    console.groupCollapsed(counted(`🏁 ${this.name} -> ${action.name}`));

    for (const [name, value] of Object.entries(action.after)) {
      this.facts[name] = value;

      const emoji = value ? `🏆` : `💸`;
      const outcome = value ? 'gained' : 'lost';

      console.log(`${emoji} ${outcome}: ${toResourceName(name)}`);
    }

    console.groupEnd();
  }

  gains<T extends ResourceName>(this: this, resource: T): void {
    this.facts[toPredicate(resource)] = true;
  }

  loses<T extends ResourceName>(this: this, resource: T): void {
    this.facts[toPredicate(resource)] = false;
  }

  makePlan(this: this): void {
    DEBUG && console.count(`🧠 ${this.name} -> planning`);

    const plan: readonly Action[] = makePlan(this.availableActions, this.facts, this.goal);

    this.plan = plan as Action[];
  }
}

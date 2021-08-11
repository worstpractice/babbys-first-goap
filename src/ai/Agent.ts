import type { GameObjects } from 'phaser';
import type { Action } from 'src/actions/Action';
import { makePlan } from 'src/ai/makePlan';
import type { LazyAction } from 'src/typings/LazyAction';
import type { AgentName } from 'src/typings/names/AgentName';
import type { FiniteStateName } from 'src/typings/names/FiniteStateName';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Position } from 'src/typings/Position';
import { arePreconditionsMetBy } from 'src/utils/arePreconditionsMetBy';
import { counted } from 'src/utils/counted';
import { boundToAction } from 'src/utils/mapping/boundToAction';
import { distanceBetween } from 'src/utils/shims/distanceBetween';

type Props = {
  readonly derivedActions: readonly LazyAction[];
  readonly image: GameObjects.Image;
  readonly initialGoal: ResourceName;
  readonly name: AgentName;
};

export class Agent {
  ////////////////////////////////////////////////////////////////////////////////////
  // * Public *
  ////////////////////////////////////////////////////////////////////////////////////
  readonly name: AgentName;

  constructor({ derivedActions, image, initialGoal, name }: Props) {
    this.availableActions = derivedActions.map(boundToAction(this)) as readonly Action[];
    this.image = image;
    this.goal = initialGoal;
    this.name = name;
  }

  update(this: this): void {
    this.state();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * Helper Function *
  ////////////////////////////////////////////////////////////////////////////////////

  /** NOTE: passes `this` to `DerivedAction`. */

  ////////////////////////////////////////////////////////////////////////////////////
  // * State Machine *
  ////////////////////////////////////////////////////////////////////////////////////

  private state = this.idling;

  private readonly costInMs = 500; // 1 cost = 0.5s;

  private isWaiting = false;

  private idling(this: this): void {
    if (!this.plan.length) return;

    this.start('moving');
  }

  private interacting(this: this): void {
    if (this.isWaiting) return;

    const nextAction = this.proceedWithPlan();

    if (!nextAction) return;

    this.isWaiting = true;

    const performAction = (): void => {
      this.isWaiting = false;

      this.attempt(nextAction);

      this.start('idling');
    };

    const kickOffTimer = (): void => {
      const delay = nextAction.cost * this.costInMs;

      window.setTimeout(performAction, delay);
    };

    window.setTimeout(kickOffTimer);
  }

  private moving(this: this): void {
    const hasArrived = this.moveToTarget();

    if (!hasArrived) return;

    this.start('interacting');
  }

  private start(this: this, name: FiniteStateName): void {
    this.update = this[name];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * Actions *
  ////////////////////////////////////////////////////////////////////////////////////

  private readonly image: GameObjects.Image;

  private get target(): Position | null {
    return this.plan.at(-1)?.target ?? null;
  }

  private moveToTarget(this: this): boolean {
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

  private attempt(this: this, action: Action): void {
    if (!arePreconditionsMetBy(this, action)) return this.makePlan();

    this.execute(action);
  }

  private execute(this: this, { after, name }: Action): void {
    console.groupCollapsed(counted(`🏁 ${this.name} -> ${name}`));

    const { gains, loses } = after;

    for (const gained of gains) {
      this.facts.add(gained);

      console.log(`🏆 gained: ${gained}`);
    }

    for (const lost of loses) {
      this.facts.delete(lost);

      console.log(`💸 lost: ${lost}`);
    }

    console.groupEnd();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * Planning *
  ////////////////////////////////////////////////////////////////////////////////////

  readonly availableActions: readonly Action[];

  facts: Set<ResourceName> = new Set<ResourceName>();

  goal: ResourceName;

  plan: Action[] = [];

  makePlan(this: this): void {
    // console.count(`🧠 ${this.name} -> planning`);

    const plan: readonly Action[] = makePlan(this.availableActions, this.facts, this.goal);

    this.plan = plan as Action[];
  }

  proceedWithPlan(this: this): Action | null {
    return this.plan.pop() ?? null;
  }

  ////////////////////////////////////////////////////////////////////////////////////
}

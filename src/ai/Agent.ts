import type { GameObjects } from 'phaser';
import type { Action } from 'src/actions/Action';
import { makePlan } from 'src/ai/makePlan';
import type { Goal } from 'src/typings/Fact';
import type { LazyAction } from 'src/typings/LazyAction';
import type { AgentName } from 'src/typings/names/AgentName';
import type { FiniteStateName } from 'src/typings/names/FiniteStateName';
import type { Position } from 'src/typings/Position';
import type { Facts } from 'src/typings/tables/Facts';
import { canExecute } from 'src/utils/arePreconditionsMet';
import { counted } from 'src/utils/counted';
import { boundToAction } from 'src/utils/mapping/boundToAction';
import { toResourceName } from 'src/utils/mapping/toResourceName';
import { distanceBetween } from 'src/utils/shims/distanceBetween';

type Props = {
  readonly derivedActions: readonly LazyAction[];
  readonly image: GameObjects.Image;
  readonly initialGoal: Goal;
  readonly initialFacts: Facts;
  readonly name: AgentName;
};

export class Agent {
  ////////////////////////////////////////////////////////////////////////////////////
  // * Public *
  ////////////////////////////////////////////////////////////////////////////////////
  readonly name: AgentName;

  constructor({ derivedActions, image, initialFacts, initialGoal, name }: Props) {
    this.availableActions = derivedActions.map(boundToAction(this)) as readonly Action[];
    this.image = image;
    this.facts = initialFacts;
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
      const costInMs = nextAction.cost * 500; // 1 cost = 0.5s;

      window.setTimeout(performAction, costInMs);
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
    return this.plan.at(-1)?.position ?? null;
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
    if (!canExecute(this, action)) return this.makePlan();

    this.execute(action);
  }

  private execute(this: this, { after, name }: Action): void {
    console.groupCollapsed(counted(`🏁 ${this.name} -> ${name}`));

    const filtered = Object.entries(after).filter(([_, value]) => {
      return value !== undefined;
    }) as (readonly ['has_ore' | 'has_pickaxe', boolean])[];

    console.log(filtered);

    for (const [name, value] of filtered) {
      this.facts[name] = value;

      const emoji = value ? `🏆` : `💸`;
      const outcome = value ? 'gained' : 'lost';

      console.log(`${emoji} ${outcome}: ${toResourceName(name)}`);
    }

    console.groupEnd();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * Planning *
  ////////////////////////////////////////////////////////////////////////////////////

  readonly availableActions: readonly Action[];

  facts: Facts;

  goal: Goal;

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

import { ObSet } from 'obset';
import type { GameObjects } from 'phaser';
import type { Action } from 'src/entities/Action';
import { makePlan } from 'src/planning/makePlan';
import type { Flag } from 'src/typings/Flag';
import type { AgentName } from 'src/typings/names/AgentName';
import type { FiniteStateName } from 'src/typings/names/FiniteStateName';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Position } from 'src/typings/Position';
import type { AgentProps } from 'src/typings/props/AgentProps';
import { arePreconditionsMetBy } from 'src/utils/arePreconditionsMetBy';
import { counted } from 'src/utils/counted';
import { boundToAction } from 'src/utils/mapping/boundToAction';
import { distanceBetween } from 'src/utils/shims/distanceBetween';

export class Agent {
  readonly availableActions: readonly Action[];

  private readonly costInMs = 500; // 1 cost = 0.5s;

  facts: ObSet<ResourceName> = new ObSet<ResourceName>()
    .on('add', ({ value }) => {
      console.log(`🏆 gained ${value}`);
    })
    .on('delete', ({ value }) => {
      console.log(`💸 lost ${value}`);
    });

  goal: ResourceName;

  private readonly image: GameObjects.Image;

  readonly state: ObSet<Flag> = new ObSet<Flag>();
  // .on('add', 'waiting', ({ value }) => {
  //   console.log(`⏳ ${this.name} started ${value}`);
  // })
  // .on('delete', 'waiting', ({ value }) => {
  //   console.log(`⌛ ${this.name} stopped ${value}`);
  // })
  // .on('add', 'planning', ({ value }) => {
  //   console.log(`🧠 ${this.name} started ${value}`);
  // })
  // .on('delete', 'planning', ({ value }) => {
  //   console.log(`🧠 ${this.name} stopped ${value}`);
  // });

  readonly name: AgentName;

  plan: Action[] = [];

  private get target(): Position | null {
    return this.plan.at(-1)?.target ?? null;
  }

  constructor({ actions, image, initialGoal, name }: AgentProps) {
    this.availableActions = actions.map(boundToAction(this)) as readonly Action[];
    this.image = image;
    this.goal = initialGoal;
    this.name = name;
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * State Machine *
  ////////////////////////////////////////////////////////////////////////////////////

  update = this.idling;

  private idling(this: this): void {
    if (!this.plan.length) return;

    this.transitionTo('moving');
  }

  private interacting(this: this): void {
    if (this.state.has('waiting')) return;

    const nextAction = this.proceedWithPlan();

    if (!nextAction) return;

    this.state.add('waiting');

    const performAction = (): void => {
      this.state.delete('waiting');

      this.attempt(nextAction);

      this.transitionTo('idling');
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

    this.transitionTo('interacting');
  }

  private transitionTo(this: this, name: FiniteStateName): void {
    this.update = this[name];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * Actions *
  ////////////////////////////////////////////////////////////////////////////////////

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
    console.group(counted(`🏁 ${this.name} completed ${name}`));

    const { gains, loses } = after;

    for (const gained of gains) {
      this.facts.add(gained);
    }

    for (const lost of loses) {
      this.facts.delete(lost);
    }

    console.groupEnd();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // * Planning *
  ////////////////////////////////////////////////////////////////////////////////////

  makePlan(this: this): void {
    // console.count(`🧠 ${this.name} -> planning`);

    this.state.add('planning');

    const plan: readonly Action[] = makePlan(this.availableActions, this.facts, this.goal);

    this.plan = plan as Action[];

    this.state.delete('planning');
  }

  proceedWithPlan(this: this): Action | null {
    return this.plan.pop() ?? null;
  }
}

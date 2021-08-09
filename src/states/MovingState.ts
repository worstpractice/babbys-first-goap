import type { Agent } from '../ai/Agent';
import { distanceBetween } from '../utils/distanceBetween';
import type { State } from '../typings/State';

export class MovingState implements State {
  private readonly entity: Agent;

  constructor(entity: Agent) {
    this.entity = entity;
  }

  enter(this: this): void {
    console.debug(`${this.entity.name} enters ${this.constructor.name}`);

    this.entity.target = this.entity?.currentPlan?.[0]?.position ?? null;
  }

  leave(this: this): void {
    console.debug(`${this.entity.name} leaves ${this.constructor.name}`);
  }

  update(this: this): void {
    const { sprite, stateMachine, target } = this.entity;

    if (!target) return;

    const { x: spriteX, y: spriteY } = sprite;
    const { x: targetX, y: targetY } = target;

    const distance = distanceBetween(spriteX, spriteY, targetX, targetY);

    const horizontal = distanceBetween(spriteX + 1, spriteY, targetX, targetY);
    const changeX = horizontal < distance ? 1 : -1;

    const vertical = distanceBetween(spriteX, spriteY + 1, targetX, targetY);
    const changeY = vertical < distance ? 1 : -1;

    sprite.x += changeX;
    sprite.y += changeY;

    const hasArrived = distance < 10;

    if (!hasArrived) return;

    this.entity.target = null;
    stateMachine.enter('action');
  }
}

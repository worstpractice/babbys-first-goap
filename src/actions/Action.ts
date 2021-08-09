import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Predicate } from '../typings/Predicate';
import type { Position } from '../typings/Position';
import type { Facts } from '../typings/Facts';
import type { ResourceName } from '../typings/ResourceName';

export class Action {
  private readonly name: string;

  protected readonly agent: Agent;

  readonly postConditions: Facts = {
    has_ore: false,
    has_pickaxe: false,
  };

  readonly preConditions: Facts = {
    has_ore: false,
    has_pickaxe: false,
  };

  readonly cost: number;

  readonly position: Position;

  constructor(name: ActionName, cost: number, position: Position, agent: Agent) {
    this.name = name;
    this.cost = cost;
    this.position = position;
    this.agent = agent;
  }

  protected gains<T extends ResourceName>(name: T): this {
    const predicate: Predicate<T> = `has_${name}` as const;

    this.from(predicate, false);
    this.to(predicate, true);

    return this;
  }

  protected loses<T extends ResourceName>(name: T): this {
    const predicate: Predicate<T> = `has_${name}` as const;

    this.from(predicate, true);
    this.to(predicate, false);

    return this;
  }

  protected exchanges<T extends ResourceName, U extends ResourceName>(payment: T, purchase: U): this {
    this.loses(payment);
    this.gains(purchase);

    return this;
  }

  protected from(this: this, name: Predicate, value: boolean): this {
    this.preConditions[name] = value;

    return this;
  }

  protected to(this: this, name: Predicate, value: boolean): this {
    this.postConditions[name] = value;

    return this;
  }

  execute(this: this): void {
    console.warn(`${this.name}: You might want to override execute for me :P`);
  }

  canExecute(this: this): boolean {
    return true;
  }
}

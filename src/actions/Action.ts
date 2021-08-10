import type { Agent } from '../ai/Agent';
import type { ActionName } from '../typings/ActionName';
import type { Position } from '../typings/Position';
import type { ResourceName } from '../typings/ResourceName';
import type { Facts } from '../typings/tables/Facts';
import { arePreconditionsMet } from '../utils/arePreconditionsMet';
import { toPredicate } from '../utils/mapping/toPredicate';

export class Action {
  private readonly name: string;

  protected readonly agent: Agent;

  readonly before: Facts = {
    has_ore: false,
    has_pickaxe: false,
  };

  readonly after: Facts = {
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

  protected retrieves<T extends ResourceName>(resource: T): void {
    this.cannotHave(resource);
    this.gains(resource);
  }

  protected delivers<T extends ResourceName>(resource: T): void {
    this.mustHave(resource);
    this.loses(resource);
  }

  protected exchanges<T extends ResourceName, U extends ResourceName>(resource: T, desiredResource: U): void {
    this.delivers(resource);
    this.retrieves(desiredResource);
  }

  protected mustHave<T extends ResourceName>(this: this, resource: T): void {
    this.before[toPredicate(resource)] = true;
  }

  protected cannotHave<T extends ResourceName>(this: this, resource: T): void {
    this.before[toPredicate(resource)] = false;
  }

  protected gains<T extends ResourceName>(this: this, resource: T): void {
    this.after[toPredicate(resource)] = true;
  }

  protected loses<T extends ResourceName>(this: this, resource: T): void {
    this.after[toPredicate(resource)] = false;
  }

  execute(this: this): void {
    console.warn(`${this.name}: You might want to override execute for me :P`);
  }

  canExecute(this: this): boolean {
    return arePreconditionsMet(this.agent, this);
  }
}

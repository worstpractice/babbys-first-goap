import type { Agent } from 'src/ai/Agent';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Position } from 'src/typings/Position';
import type { Facts } from 'src/typings/tables/Facts';
import { canExecute } from 'src/utils/arePreconditionsMet';
import { toPredicate } from 'src/utils/mapping/toPredicate';
import { toSnakeCase } from 'src/utils/mapping/toSnakeCase';

export type ActionProps = {
  readonly agent: Agent;
  readonly cost: number;
  readonly position: Position;
};

export class Action {
  readonly cost: number;

  readonly name: string;

  protected readonly agent: Agent;

  readonly before: Partial<Facts> = {};

  readonly after: Partial<Facts> = {};

  readonly position: Position;

  constructor({ agent, cost, position }: ActionProps) {
    this.cost = cost;
    this.name = toSnakeCase(new.target.name);
    this.position = position;
    this.agent = agent;
  }

  protected willRetrieve<T extends ResourceName>(resource: T): void {
    this.cannotHave(resource);
    this.willGain(resource);
  }

  protected willDeliver<T extends ResourceName>(resource: T): void {
    this.mustHave(resource);
    this.willLose(resource);
  }

  protected willExchange<T extends ResourceName, U extends ResourceName>(resource: T, desiredResource: U): void {
    this.willDeliver(resource);
    this.willRetrieve(desiredResource);
  }

  protected mustHave<T extends ResourceName>(this: this, resource: T): void {
    this.before[toPredicate(resource)] = true;
  }

  protected cannotHave<T extends ResourceName>(this: this, resource: T): void {
    this.before[toPredicate(resource)] = false;
  }

  protected willGain<T extends ResourceName>(this: this, resource: T): void {
    this.after[toPredicate(resource)] = true;
  }

  protected willLose<T extends ResourceName>(this: this, resource: T): void {
    this.after[toPredicate(resource)] = false;
  }

  canExecute(this: this): boolean {
    return canExecute(this.agent, this);
  }
}

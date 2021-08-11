import type { Agent } from 'src/ai/Agent';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Position } from 'src/typings/Position';
import { toSnakeCase } from 'src/utils/mapping/toSnakeCase';

export type ActionProps = {
  readonly agent: Agent;
  readonly cost: number;
  readonly target: Position;
};

// Action should really have a concept of doer/performer (of action) & target (of action)

export class Action {
  readonly cost: number;

  readonly name: string;

  readonly target: Position;// should really be over at `Station.position`

  readonly before = {
    has: new Set<ResourceName>(),
    lacks: new Set<ResourceName>(),
  };

  readonly after = {
    gains: new Set<ResourceName>(),
    loses: new Set<ResourceName>(),
  };

  constructor({ cost, target }: ActionProps) {
    this.cost = cost;
    this.name = toSnakeCase(new.target.name);
    this.target = target;
  }

  protected willRetrieve<T extends ResourceName>(resource: T): void {
    this.mustLack(resource);
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
    this.before.has.add(resource);
  }

  protected mustLack<T extends ResourceName>(this: this, resource: T): void {
    this.before.lacks.add(resource);
  }

  protected willGain<T extends ResourceName>(this: this, resource: T): void {
    this.after.gains.add(resource);
  }

  protected willLose<T extends ResourceName>(this: this, resource: T): void {
    this.after.loses.add(resource);
  }
}

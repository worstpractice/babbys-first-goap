import type { Predicate } from '../../../typings/Predicate';
import type { ResourceName } from '../../../typings/ResourceName';

export const toPredicate = <T extends ResourceName>(name: T): Predicate<T> => {
  return `has_${name}` as const;
};

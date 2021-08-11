import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Predicate } from 'src/typings/Predicate';

export const toPredicate = <T extends ResourceName>(name: T): Predicate<T> => {
  return `has_${name}` as const;
};

import type { ResourceName } from 'src/typings/names/ResourceName';
import type { Predicate } from 'src/typings/Predicate';

export const toResourceName = <T extends ResourceName>(predicate: Predicate<T>): T => {
  const [has_, ...name] = predicate.split('_');

  return name.join('_') as T;
};

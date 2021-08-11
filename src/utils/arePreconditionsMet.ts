import type { Action } from 'src/actions/Action';
import type { Facts } from 'src/typings/tables/Facts';

export const arePreconditionsMet = <T extends { readonly facts: Facts }>({ facts }: T, { before }: Action): boolean => {
  for (const [key, value] of Object.entries(before)) {
    if (facts[key] !== value) return false;
  }

  return true;
};

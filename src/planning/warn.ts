import type { Action } from 'src/entities/Action';
import type { ResourceName } from 'src/typings/names/ResourceName';

export const warn = (reason: string, actions: readonly Action[], facts: Set<ResourceName>, goal: ResourceName): void => {
  console.group();
  console.warn(reason);
  console.warn(`Goal "${goal}" is unreachable!`);
  console.warn('Current facts', facts);
  console.warn('Available actions', actions);
  console.groupEnd();
  debugger; // eslint-disable-line no-debugger
};

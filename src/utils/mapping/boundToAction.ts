import type { Action } from 'src/entities/Action';
import type { Agent } from 'src/entities/Agent';
import type { LazyAction } from 'src/typings/LazyAction';

export const boundToAction = (agent: Agent) => {
  const toAction = ([DerivedAction, props]: LazyAction): Action => {
    return new DerivedAction({ ...props, agent });
  };

  return toAction;
};

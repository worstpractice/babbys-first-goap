import type { ActionProps } from 'src/actions/Action';
import { Action } from 'src/actions/Action';

export class RetrieveOre extends Action {
  constructor(props: ActionProps) {
    super(props);

    this.willRetrieve('ore');
  }

  execute(this: this): void {
    console.count(`🔨 ${this.agent.name} -> ${this.name}`);
  }
}

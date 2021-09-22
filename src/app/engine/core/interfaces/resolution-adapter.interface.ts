import { ISize } from '../size';
import { EventEmitter } from '../event-emmiter';

export interface IResolutionWatcher {
  readonly currentResolution: ISize;
  readonly onChange: EventEmitter<ISize>;
}

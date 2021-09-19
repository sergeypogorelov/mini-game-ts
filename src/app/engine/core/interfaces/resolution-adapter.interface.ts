import { ISize } from '../size';
import { EventEmitter } from '../event-emmiter';

export interface IResolutionAdapter {
  readonly currentResolution: ISize;
  readonly onChange: EventEmitter<ISize>;
}

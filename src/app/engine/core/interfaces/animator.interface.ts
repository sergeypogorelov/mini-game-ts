import { EventEmitter } from '../event-emmiter';

export interface IAnimator {
  readonly onBeforeRepaint: EventEmitter<number>;
}

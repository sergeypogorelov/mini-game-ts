import { EventEmitter } from '../event-emmiter';
import { IPoint } from '../point';

export interface IPlayerInput {
  readonly onScreenTouch: EventEmitter<IPoint>;
}

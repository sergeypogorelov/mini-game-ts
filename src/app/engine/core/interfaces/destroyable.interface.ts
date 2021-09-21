import { EventEmitter } from '../event-emmiter';

export interface IDestroyable {
  onDisposalReady: EventEmitter<void>;
  destroy(): void;
}

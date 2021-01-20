import { SyncEventHandler } from './sync-event-handler.type';
import { SyncEventSubscription } from './sync-event-subscription.interface';

/**
 * A sync event
 */
export interface SyncEvent<T> {
  /**
   * Subscribes a handler on the sync event
   * @param eventHandler A handler to subscribe
   * @returns A sync event subscription to unsubscribe the passed handler
   */
  subscribe(eventHandler: SyncEventHandler<T>): SyncEventSubscription;
}

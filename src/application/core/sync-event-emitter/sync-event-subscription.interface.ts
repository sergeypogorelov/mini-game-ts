/**
 * Subscription of a sync event
 */
export interface SyncEventSubscription {
  /**
   * Unsubscribes the event handler from the event
   */
  unsubscribe(): void;
}

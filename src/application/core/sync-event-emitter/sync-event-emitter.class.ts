import { SyncEvent } from './sync-event.interface';
import { SyncEventSubscription } from './sync-event-subscription.interface';

import { SyncEventHandler } from './sync-event-handler.type';

/**
 * A sync event which can emit itself
 */
export class SyncEventEmitter<T> implements SyncEvent<T> {
  /**
   * Creates a sync event emitter
   */
  public constructor() {
    this._event = {
      subscribe: (eventHandler: SyncEventHandler<T>) => this.subscribe(eventHandler),
    };
  }

  /**
   * Subscribes a handler on the event emitter
   * @param eventHandler A handler to subscribe
   * @returns A sync event subscription to unsubscribe the passed handler
   */
  public subscribe(eventHandler: SyncEventHandler<T>): SyncEventSubscription {
    if (!eventHandler) {
      throw new Error('Event handler is not defined.');
    }

    const wrappedEventHandler: SyncEventHandler<T> = (value?: T) => eventHandler(value);
    this._handlers.push(wrappedEventHandler);

    const subscription: SyncEventSubscription = {
      unsubscribe: () => {
        const foundIndex = this._handlers.indexOf(wrappedEventHandler);
        this._handlers.splice(foundIndex, 1);
      },
    };

    return subscription;
  }

  /**
   * Emits the event with the specified data
   * @param value Event data
   */
  public emit(value?: T): void {
    this._handlers.forEach((action) => action(value));
  }

  /**
   * Converts the current event emitter into a sync event
   * @returns The current event emitter as a sync event
   */
  public asEvent(): SyncEvent<T> {
    return this._event;
  }

  /**
   * The sync event representation of the current event emitter
   */
  private _event: SyncEvent<T>;

  /**
   * All handlers for the current event emitter
   */
  private _handlers: SyncEventHandler<T>[] = [];
}

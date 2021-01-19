import { SimpleEventHandler } from './simple-event-handler.type';
import { SimpleEventSubscription } from './simple-event-subscription.interface';
import { SimpleEvent } from './simple-event.interface';

export class SimpleEventEmitter<T> implements SimpleEvent<T> {
  public constructor() {
    this._event = {
      subscribe: (eventHandler: SimpleEventHandler<T>) => this.subscribe(eventHandler),
    };
  }

  public subscribe(eventHandler: SimpleEventHandler<T>): SimpleEventSubscription {
    if (!eventHandler) {
      throw new Error('Event handler is not defined.');
    }

    const wrappedEventHandler: SimpleEventHandler<T> = (value?: T) => eventHandler(value);
    this._handlers.push(wrappedEventHandler);

    const subscription: SimpleEventSubscription = {
      unsubscribe: () => {
        const foundIndex = this._handlers.indexOf(wrappedEventHandler);
        if (foundIndex !== -1) {
          this._handlers.splice(foundIndex, 1);
        }
      },
    };

    return subscription;
  }

  public emit(value?: T): void {
    this._handlers.forEach((action) => action(value));
  }

  public asEvent(): SimpleEvent<T> {
    return this._event;
  }

  private _event: SimpleEvent<T>;

  private _handlers: SimpleEventHandler<T>[] = [];
}

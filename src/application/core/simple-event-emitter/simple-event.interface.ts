import { SimpleEventHandler } from './simple-event-handler.type';
import { SimpleEventSubscription } from './simple-event-subscription.interface';

export interface SimpleEvent<T> {
  subscribe(eventHandler: SimpleEventHandler<T>): SimpleEventSubscription;
}

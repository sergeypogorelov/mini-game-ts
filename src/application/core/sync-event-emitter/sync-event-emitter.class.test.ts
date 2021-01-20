import { SyncEventEmitter } from './sync-event-emitter.class';

describe('SyncEventEmitter', () => {
  let data: string;
  let emitter: SyncEventEmitter<string>;

  beforeEach(() => {
    data = 'data';
    emitter = new SyncEventEmitter();
  });

  it('should throw an exception if the specified handler is undefined while subscribing', () => {
    const errorMessage = 'Event handler is not defined.';

    const fnForEventEmitter = () => {
      emitter.subscribe(undefined);
    };

    const fnForEvent = () => {
      emitter.asEvent().subscribe(undefined);
    };

    expect(fnForEventEmitter).toThrow(errorMessage);
    expect(fnForEvent).toThrow(errorMessage);
  });

  it('should call a handler after subscribing on the event emitter and emitting', () => {
    const handler = jest.fn();

    emitter.subscribe(handler);
    emitter.emit(data);

    expect(handler).toBeCalledWith(data);
  });

  it('should not call a handler if the handler is removed from the event emitter', () => {
    const handler = jest.fn();

    const subscription = emitter.subscribe(handler);

    expect(subscription).toBeDefined();
    expect(subscription.unsubscribe).toBeDefined();

    subscription.unsubscribe();
    emitter.emit(data);

    expect(handler).not.toBeCalled();
  });

  it('should call a handler after subscribing on the event and emitting', () => {
    const handler = jest.fn();

    const event = emitter.asEvent();

    expect(event).toBeDefined();

    event.subscribe(handler);
    emitter.emit(data);

    expect(handler).toBeCalledWith(data);
  });

  it('should not call a handler if the handler is removed from the event', () => {
    const handler = jest.fn();

    const event = emitter.asEvent();

    expect(event).toBeDefined();

    const subscription = event.subscribe(handler);

    expect(subscription).toBeDefined();
    expect(subscription.unsubscribe).toBeDefined();

    subscription.unsubscribe();
    emitter.emit(data);

    expect(handler).not.toBeCalled();
  });
});

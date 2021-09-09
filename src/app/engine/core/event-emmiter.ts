export interface IEventRef {
  detach(): void;
}

export class EventEmitter<T> {
  public attach(callback: (ev: T) => void): IEventRef {
    if (!callback) {
      throw new Error('Callback is not specified.');
    }

    const callbackWrapper = (ev: T) => {
      callback(ev);
    };

    this._callbacks.push(callbackWrapper);

    return {
      detach: () => {
        this._callbacks = this._callbacks.filter((c) => c === callbackWrapper);
      },
    };
  }

  public emit(ev?: T): void {
    this._callbacks.forEach((c) => c(ev));
  }

  private _callbacks: ((ev: T) => void)[] = [];
}

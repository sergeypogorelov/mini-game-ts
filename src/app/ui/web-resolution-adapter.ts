import { IResolutionAdapter } from '../engine/core/interfaces/resolution-adapter.interface';

import { ISize, Size } from '../engine/core/size';
import { EventEmitter } from '../engine/core/event-emmiter';

export class WebResolutionAdapter implements IResolutionAdapter {
  public static readonly defDelay = 20;

  public static readonly indent = 2;

  public static readonly minWidth = 140;

  public static readonly minHeight = 50;

  public readonly onChange: EventEmitter<ISize>;

  public get delay(): number {
    return this._delay;
  }

  public get isInProgress(): boolean {
    return this._isInProgress;
  }

  public get currentResolution(): ISize {
    const indent = WebResolutionAdapter.indent;

    let width = window.innerWidth - indent;
    let height = window.innerHeight - indent;

    if (width < WebResolutionAdapter.minWidth) {
      width = WebResolutionAdapter.minWidth;
    }

    if (height < WebResolutionAdapter.minHeight) {
      height = WebResolutionAdapter.minHeight;
    }

    return new Size(width, height);
  }

  public constructor(delay = WebResolutionAdapter.defDelay) {
    this.setDelay(delay);

    this.onChange = new EventEmitter<ISize>();
  }

  public startWatching(): void {
    if (this.isInProgress) {
      throw new Error('Resolution observing is already in progress.');
    }

    this._isInProgress = true;

    this._callback = () => {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
      }

      this._timeoutId = setTimeout(() => {
        this.onChange.emit(this.currentResolution);
      }, this.delay);
    };

    window.addEventListener('resize', this._callback);
  }

  public stopWatching(): void {
    if (!this.isInProgress) {
      throw new Error('Resolution observing has not been started yet.');
    }

    if (!this._callback) {
      throw new Error('Callback is not specified.');
    }

    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    window.removeEventListener('resize', this._callback);

    this._callback = null;
    this._isInProgress = false;
  }

  private _delay: number;

  private _isInProgress: boolean;

  private _timeoutId: NodeJS.Timeout;

  private _callback: () => void;

  private setDelay(delay: number): void {
    if (!delay) {
      throw new Error('Delay is not specified.');
    }

    if (delay <= 0) {
      throw new Error('Delay should be greater than 0.');
    }

    this._delay = delay;
  }
}

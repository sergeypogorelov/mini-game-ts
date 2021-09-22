import { IPlayerInput } from '../engine/core/interfaces/player-input.interface';

import { IPoint, Point } from '../engine/core/point';
import { EventEmitter } from '../engine/core/event-emmiter';

export class WebPlayerInput implements IPlayerInput {
  public readonly onScreenTouch: EventEmitter<IPoint>;

  public get isHandling(): boolean {
    return Boolean(this._callback);
  }

  public get canvasEl(): HTMLCanvasElement {
    return this._canvasEl;
  }

  public constructor(canvasEl: HTMLCanvasElement) {
    this.setCanvasEl(canvasEl);

    this.onScreenTouch = new EventEmitter<IPoint>();
  }

  public startHandling(): void {
    if (this.isHandling) {
      throw new Error('Player input is already being handled.');
    }

    this._callback = (ev) => {
      const touchPoint = new Point(ev.x, ev.y);
      this.onScreenTouch.emit(touchPoint);
    };

    this.canvasEl.addEventListener('click', this._callback);
  }

  public stopHandling(): void {
    if (!this.isHandling) {
      throw new Error('Player input is not being handled yet.');
    }

    this.canvasEl.removeEventListener('click', this._callback);

    this._callback = null;
  }

  private _canvasEl: HTMLCanvasElement;

  private _callback: (ev: MouseEvent) => void;

  private setCanvasEl(el: HTMLCanvasElement): void {
    if (!el) {
      throw new Error('Canvas element is not specified.');
    }

    this._canvasEl = el;
  }
}

import { IAnimator } from '../engine/core/interfaces/animator.interface';
import { EventEmitter } from '../engine/core/event-emmiter';

export class WebAnimator implements IAnimator {
  public readonly onBeforeRepaint: EventEmitter<number>;

  public get isRunning(): boolean {
    return Boolean(this._prevDate);
  }

  public constructor() {
    this.onBeforeRepaint = new EventEmitter<number>();
  }

  public startAnimating(): void {
    if (this.isRunning) {
      throw new Error('Animator has been already started.');
    }

    this._prevDate = new Date();
    this._isFirstEmit = true;

    this.emit();
  }

  public stopAnimating(): void {
    if (!this.isRunning) {
      throw new Error('Animator has not been started yet.');
    }

    this._prevDate = null;
  }

  private _prevDate: Date;

  private _isFirstEmit: boolean;

  private emit(): void {
    if (this._isFirstEmit) {
      this._isFirstEmit = false;

      requestAnimationFrame(() => this.emit());

      return;
    }

    if (!this._prevDate) {
      return;
    }

    const newDate = new Date();
    const dt = newDate.getTime() - this._prevDate.getTime();

    this.onBeforeRepaint.emit(dt);

    this._prevDate = newDate;

    requestAnimationFrame(() => this.emit());
  }
}

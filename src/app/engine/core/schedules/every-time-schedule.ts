import { Schedule } from './schedule';

export class EveryTimeSchedule extends Schedule<number> {
  public get frequency(): number {
    return this._frequency;
  }

  public get counter(): number {
    return this._counter;
  }

  public constructor(frequencyInMs: number) {
    super();
    this.setFrequency(frequencyInMs);
  }

  public checkTick(dt: number): boolean {
    const counter = Math.floor((this.timePassed + dt) / this.frequency);
    return counter > this.counter;
  }

  public update(dt: number): void {
    const shouldEmitTick = this.checkTick(dt);

    if (shouldEmitTick) {
      this._counter++;
      this.onTickBeforeUpdate.emit(this._counter);
    }

    super.update(dt);

    if (shouldEmitTick) {
      this.onTickAfterUpdate.emit(this._counter);
    }
  }

  public reset(): void {
    super.reset();

    this._counter = 0;
  }

  private _frequency: number;

  private _counter: number;

  private setFrequency(frequency: number): void {
    if (!frequency && typeof frequency !== 'number') {
      throw new Error('Frequency is not specified.');
    }

    if (frequency <= 0) {
      throw new Error('Frequency should more than zero.');
    }

    this._frequency = frequency;
  }
}

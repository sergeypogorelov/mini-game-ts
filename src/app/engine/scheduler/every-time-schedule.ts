import { Schedule } from './schedule';

export class EveryTimeSchedule extends Schedule {
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

  public checkBeforeUpdate(dt: number): boolean {
    const count = Math.floor((this.timePassed + dt) / this.frequency);
    return count > this._counter;
  }

  public update(dt: number): void {
    if (this.checkBeforeUpdate(dt)) {
      this._counter++;
    }

    super.update(dt);
  }

  public checkAfterUpdate(): boolean {
    const count = Math.floor(this.timePassed / this.frequency);
    return count > this._counter;
  }

  public changeFrequency(frequencyInMs: number): void {
    this.setFrequency(frequencyInMs);
    this.reset();
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

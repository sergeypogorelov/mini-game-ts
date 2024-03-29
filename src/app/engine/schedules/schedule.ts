import { IUpdateable } from '../core/interfaces/updateable.interface';

import { EventEmitter } from '../core/event-emmiter';

export abstract class Schedule<T> implements IUpdateable {
  public readonly onTickBeforeUpdate = new EventEmitter<T>();

  public readonly onTickAfterUpdate = new EventEmitter<T>();

  public constructor() {
    this.reset();
  }

  public reset(): void {
    this.timePassed = 0;
  }

  public update(dt: number): void {
    this.timePassed += dt;
  }

  protected timePassed: number;
}

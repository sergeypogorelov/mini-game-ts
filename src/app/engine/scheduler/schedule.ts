import { IUpdateable } from '../updateable.interface';

export abstract class Schedule implements IUpdateable {
  public constructor() {
    this.reset();
  }

  public abstract checkBeforeUpdate(dt: number): boolean;

  public abstract checkAfterUpdate(): boolean;

  public check(dt?: number): boolean {
    if (dt) {
      return this.checkBeforeUpdate(dt);
    }

    return this.checkAfterUpdate();
  }

  public reset(): void {
    this.timePassed = 0;
  }

  public update(dt: number): void {
    this.timePassed += dt;
  }

  protected timePassed: number;
}

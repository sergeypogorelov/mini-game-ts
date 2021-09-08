import { IUpdateable } from '../updateable.interface';
import { Schedule } from './schedule';

export class Scheduler implements IUpdateable {
  public get schedule(): Schedule {
    return this._schedule;
  }

  public constructor(schedule: Schedule) {
    this.setSchedule(schedule);
  }

  public static create(schedule: Schedule): Scheduler {
    if (!schedule) {
      throw new Error('Schedule is not specified.');
    }

    return new Scheduler(schedule);
  }

  public check(dt?: number): boolean {
    return this.schedule.check(dt);
  }

  public checkBeforeUpdate(dt: number): boolean {
    return this.schedule.checkBeforeUpdate(dt);
  }

  public update(dt: number): void {
    this.schedule.update(dt);
  }

  public checkAfterUpdate(): boolean {
    return this.schedule.checkAfterUpdate();
  }

  private _schedule: Schedule;

  private setSchedule(schedule: Schedule): void {
    if (!schedule) {
      throw new Error('Schedule is not specified.');
    }

    this._schedule = schedule;
  }
}

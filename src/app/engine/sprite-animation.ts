import { IUpdateable } from './updateable.interface';

import { IPoint } from './point';
import { ISize } from './size';
import { ISpriteFrame, Sprite } from './sprite';

import { Scheduler } from './scheduler/scheduler';
import { EveryTimeSchedule } from './scheduler/every-time-schedule';

import { IRenderParams, Renderer } from './renderer';

export interface ISpriteAnimationConfig {
  readonly sprite: Sprite;

  readonly isInfinite?: boolean;
  readonly speed?: number;
}

export interface ISpriteRenderParams {
  readonly renderer: Renderer;
  readonly destPointInUnits: IPoint;
  readonly destSizeInUnits?: ISize;
}

export class SpriteAnimation implements IUpdateable {
  public static readonly defSpeed = 12;

  public get isFinished(): boolean {
    return this._isFinished;
  }

  public get timePerFrame(): number {
    return 1000 / this._config.speed;
  }

  public get timePerAllFrames(): number {
    return this.timePerFrame * this._config.sprite.frames.length;
  }

  public get currentFrameIndex(): number {
    return this._currentFrameIndex;
  }

  public constructor(config: ISpriteAnimationConfig) {
    this.setConfig(config);
    this.setSchedulers();
  }

  public getCurrentFrame(): ISpriteFrame {
    let index = this._currentFrameIndex;

    const { frames } = this._config.sprite;
    if (index >= frames.length) {
      index = frames.length - 1;
    }

    return frames[index];
  }

  public update(dt: number): void {
    if (this.isFinished) {
      return;
    }

    if (this._schedulerForFrame.check(dt)) {
      this._currentFrameIndex++;
    }

    if (this._schedulerForAllFrames.check(dt)) {
      if (this._config.isInfinite) {
        this.reset();
      } else {
        this._isFinished = true;
      }

      return;
    }

    this._schedulerForFrame.update(dt);
    this._schedulerForAllFrames.update(dt);
  }

  public reset(): void {
    this._currentFrameIndex = 0;

    this._schedulerForFrame.schedule.reset();
    this._schedulerForAllFrames.schedule.reset();
  }

  public render(params: ISpriteRenderParams): void {
    const { renderer, destPointInUnits, destSizeInUnits } = params;
    const { srcPoint: srcPointInPixels, srcSize: srcSizeInPixels } = this.getCurrentFrame();
    const { image } = this._config.sprite;

    const renderParams: IRenderParams = {
      image,
      srcPointInPixels,
      srcSizeInPixels,
      destPointInUnits,
      destSizeInUnits,
    };

    renderer.render(renderParams);
  }

  private _isFinished = false;

  private _currentFrameIndex = 0;

  private _config: ISpriteAnimationConfig;

  private _schedulerForFrame: Scheduler;

  private _schedulerForAllFrames: Scheduler;

  private setConfig(cfg: ISpriteAnimationConfig): void {
    if (!cfg) {
      throw new Error('Sprite animation config is not defined.');
    }

    if (!cfg.sprite) {
      throw new Error('Sprite is not found in sprite animation config.');
    }

    this._config = {
      sprite: cfg.sprite,
      speed: cfg.speed ?? SpriteAnimation.defSpeed,
      isInfinite: cfg.isInfinite ?? false,
    };
  }

  private setSchedulers(): void {
    this._schedulerForFrame = Scheduler.create(new EveryTimeSchedule(this.timePerFrame));
    this._schedulerForAllFrames = Scheduler.create(new EveryTimeSchedule(this.timePerAllFrames));
  }
}

import { IUpdateable } from './interfaces/updateable.interface';

import { IPoint } from './point';
import { ISize } from './size';

import { ISpriteFrame, Sprite } from './sprite';
import { IRenderParams, Renderer } from './renderer';

import { EveryTimeSchedule } from '../schedules/every-time-schedule';

export interface ISpriteAnimationConfig {
  readonly sprite: Sprite;

  readonly isInfinite?: boolean;
  readonly speed?: number;
}

export class SpriteAnimation implements IUpdateable {
  public static readonly defSpeed = 12;

  public get timePerFrame(): number {
    return 1000 / this._config.speed;
  }

  public get timePerAllFrames(): number {
    return this.timePerFrame * this._config.sprite.frames.length;
  }

  public constructor(config: ISpriteAnimationConfig) {
    this.setConfig(config);
    this.setSchedules();
  }

  public getCurrentFrame(): ISpriteFrame {
    let index = this._currentFrameIndex;

    const { frames } = this._config.sprite;
    if (index >= frames.length) {
      index = frames.length - 1;
      console.error(this);
    }

    return frames[index];
  }

  public update(dt: number): void {
    if (this._shouldPreventUpdateOnce) {
      this._shouldPreventUpdateOnce = false;
      return;
    }

    if (this._isFinished) {
      return;
    }

    this._singleFrameSchedule.update(dt);
    this._allFramesSchedule.update(dt);
  }

  public render(renderer: Renderer, destPointInUnits: IPoint, destSizeInUnits: ISize): void {
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

  public reset(): void {
    this._currentFrameIndex = 0;

    this._singleFrameSchedule.reset();
    this._allFramesSchedule.reset();
  }

  private _isFinished = false;

  private _shouldPreventUpdateOnce = false;

  private _currentFrameIndex = 0;

  private _config: ISpriteAnimationConfig;

  private _singleFrameSchedule: EveryTimeSchedule;

  private _allFramesSchedule: EveryTimeSchedule;

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

  private setSchedules(): void {
    this._singleFrameSchedule = new EveryTimeSchedule(this.timePerFrame);
    this._singleFrameSchedule.onTickBeforeUpdate.attach(() => {
      this._currentFrameIndex++;
    });

    this._allFramesSchedule = new EveryTimeSchedule(this.timePerAllFrames);
    this._allFramesSchedule.onTickBeforeUpdate.attach(() => {
      if (this._config.isInfinite) {
        this.reset();
      } else {
        this._isFinished = true;
      }

      this._shouldPreventUpdateOnce = true;
    });
  }
}
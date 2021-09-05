import { IUpdateable } from './updateable.interface';

import { IPoint } from './point';
import { ISize } from './size';
import { ISpriteFrame, Sprite } from './sprite';

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

  public get timePerFrame(): number {
    return 1000 / this._config.speed;
  }

  public get timePerAllFrames(): number {
    return this.timePerFrame * this._config.sprite.frames.length;
  }

  public constructor(config: ISpriteAnimationConfig) {
    this.setConfig(config);
    this.reset();
  }

  public getCurrentFrame(): ISpriteFrame {
    let index = Math.floor(this._dt / this.timePerFrame);

    const { frames } = this._config.sprite;
    if (index >= frames.length) {
      index = frames.length - 1;
    }

    return frames[index];
  }

  public update(dt: number): void {
    if (this._dt + dt >= this.timePerAllFrames) {
      if (!this._config.isInfinite) {
        return;
      }

      this.reset();
    }

    this._dt += dt;
  }

  public reset(): void {
    this._dt = 0;
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

  private _dt: number;

  private _config: ISpriteAnimationConfig;

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
}

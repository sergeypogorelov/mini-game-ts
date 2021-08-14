import { IUpdateable } from './updateable.interface';
import { IDrawable, IDrawParams } from './drawable.interface';

import { ISpriteFrame, Sprite } from './sprite';
import { IPoint } from './point.interface';
import { ISize } from './size.interface';

export interface ISpriteAnimationConfig {
  readonly sprite: Sprite;

  readonly isInfinite?: boolean;
  readonly speed?: number;
}

export interface ISpriteRenderParams {
  readonly context: IDrawable;
  readonly distPoint: IPoint;

  readonly distSize?: ISize;
}

export class SpriteAnimation implements IUpdateable {
  public static readonly defSpeed = 12;

  public get config(): ISpriteAnimationConfig {
    return this._config;
  }

  public get timePerFrame(): number {
    return 1000 / this.config.speed;
  }

  public get timePerAllFrames(): number {
    return this.timePerFrame * this.config.sprite.frames.length;
  }

  public constructor(config: ISpriteAnimationConfig) {
    this.setConfig(config);
    this.reset();
  }

  public getCurrentFrame(): ISpriteFrame {
    let index = Math.floor(this._dt / this.timePerFrame);

    const { frames } = this.config.sprite;
    if (index >= frames.length) {
      index = frames.length - 1;
    }

    return frames[index];
  }

  public update(dt: number): void {
    if (this._dt + dt >= this.timePerAllFrames) {
      if (!this.config.isInfinite) {
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
    const { context, distPoint, distSize } = params;
    const { srcPoint, srcSize } = this.getCurrentFrame();

    const drawParams: IDrawParams = { srcPoint, srcSize, distPoint, distSize: distSize ?? srcSize };

    context.draw(drawParams);
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

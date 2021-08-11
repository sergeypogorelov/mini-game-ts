import { IDrawableSprite } from './drawable-sprite.interface';
import { ISpriteFrame } from './sprite-frame.interface';
import { IUpdateable } from './updateable.interface';

export class SpriteAnimation implements IUpdateable {
  public get speed(): number {
    return this._speed;
  }

  public get frames(): ISpriteFrame[] {
    return this._frames;
  }

  public get currentFrame(): ISpriteFrame {
    const index = Math.floor(this._dt / (1000 / this.speed));
    if (index === this.frames.length - 1) {
      this.reset();
    }
    return this._frames[index];
  }

  private _dt: number;

  private _speed: number;

  private _frames: ISpriteFrame[];

  public static createFromArray(frames: number[][], speed: number): SpriteAnimation {
    if (!frames) {
      throw new Error('Frames are not specified.');
    }

    return new SpriteAnimation(
      frames.map((f) => ({ x: f[0], y: f[1], width: f[2], height: f[3] })),
      speed,
    );
  }

  public constructor(frames: ISpriteFrame[], speed: number) {
    this.setSpeed(speed);
    this.setFrames(frames);

    this.reset();
  }

  public update(dt: number): void {
    this._dt += dt;
  }

  public reset(): void {
    this._dt = 0;
  }

  public render(drawableObject: IDrawableSprite): void {
    const { x, y, width, height } = this.currentFrame;

    drawableObject.draw(x, y, width, height);
  }

  private setSpeed(speed: number): void {
    if (speed <= 0) {
      throw new Error('Speed should be greater than 0.');
    }

    this._speed = speed;
  }

  private setFrames(frames: ISpriteFrame[]): void {
    if (!frames) {
      throw new Error('Sprite frames are not specified.');
    }

    if (frames.length === 0) {
      throw new Error('Sprite frames are not found.');
    }

    this._frames = frames;
  }
}

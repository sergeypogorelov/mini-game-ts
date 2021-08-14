import { Point } from './point';
import { Size } from './size';

export interface ISpriteFrame {
  readonly srcPoint: Point;
  readonly srcSize: Size;
}

export class Sprite {
  public get frames(): ISpriteFrame[] {
    return this._frames.slice();
  }

  public set frames(value: ISpriteFrame[]) {
    this.setFrames(value);
  }

  public constructor(frames: ISpriteFrame[]) {
    this.setFrames(frames);
  }

  public static createFromArray(frames: number[][]): Sprite {
    if (!frames) {
      throw new Error('Frames are not specified.');
    }

    return new Sprite(frames.map((i) => ({ srcPoint: new Point(i[0], i[1]), srcSize: new Size(i[2], i[3]) })));
  }

  private _frames: ISpriteFrame[];

  private setFrames(frames: ISpriteFrame[]): void {
    if (!frames) {
      throw new Error('Sprite frames are not specified.');
    }

    if (frames.length === 0) {
      throw new Error('Sprite frames are not found.');
    }

    this._frames = frames.slice();
  }
}

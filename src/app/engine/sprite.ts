import { ISpriteFrame } from './sprite-frame.interface';

export class Sprite {
  public get frames(): ISpriteFrame[] {
    return this._frames;
  }

  public set frames(value: ISpriteFrame[]) {
    this.setFrames(value);
  }

  private _frames: ISpriteFrame[];

  public constructor(frames: ISpriteFrame[]) {
    this.setFrames(frames);
  }

  public static createFromArray(frames: number[][]): Sprite {
    if (!frames) {
      throw new Error('Frames are not specified.');
    }

    return new Sprite(frames.map((i) => ({ x: i[0], y: i[1], width: i[2], height: i[3] })));
  }

  private setFrames(frames: ISpriteFrame[]): void {
    if (!frames) {
      throw new Error('Sprite frames are not specified.');
    }

    if (frames.length === 0) {
      throw new Error('Sprite frames are not found.');
    }

    this._frames = frames.map((frame) => ({ ...frame }));
  }
}

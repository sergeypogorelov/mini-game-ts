import { IPoint, Point } from './point';
import { ISize, Size } from './size';

import { IImg } from './img';

export interface ISpriteFrame {
  readonly srcPoint: IPoint;
  readonly srcSize: ISize;
}

export class Sprite {
  public get framesAreReversed(): boolean {
    return this._framesAreReversed;
  }

  public get frames(): ISpriteFrame[] {
    const frames = this._frames.slice();

    if (this.framesAreReversed) {
      return frames.reverse();
    }

    return frames;
  }

  public set frames(value: ISpriteFrame[]) {
    this.setFrames(value);
  }

  public get image(): IImg {
    return this._image;
  }

  public set image(value: IImg) {
    this.setImage(value);
  }

  public constructor(image: IImg, frames: ISpriteFrame[]) {
    this.setImage(image);
    this.setFrames(frames);
  }

  public static createFromArray(image: IImg, frames: number[][]): Sprite {
    if (!image) {
      throw new Error('Image is not specified.');
    }

    if (!frames) {
      throw new Error('Frames are not specified.');
    }

    return new Sprite(
      image,
      frames.map((i) => ({ srcPoint: new Point(i[0], i[1]), srcSize: new Size(i[2], i[3]) })),
    );
  }

  public setReversedOrderOfFrames(): void {
    if (!this.framesAreReversed) {
      this._framesAreReversed = true;
    }
  }

  public setDefaultOrderOfFrames(): void {
    if (this.framesAreReversed) {
      this._framesAreReversed = false;
    }
  }

  private _framesAreReversed: boolean;

  private _frames: ISpriteFrame[];

  private _image: IImg;

  private setFrames(frames: ISpriteFrame[]): void {
    if (!frames) {
      throw new Error('Sprite frames are not specified.');
    }

    if (frames.length === 0) {
      throw new Error('Sprite frames are not found.');
    }

    this._frames = frames.slice();
  }

  private setImage(image: IImg): void {
    if (!image) {
      throw new Error('Image is not specified.');
    }

    this._image = image;
  }
}

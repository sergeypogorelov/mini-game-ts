export interface ISize {
  readonly width: number;
  readonly height: number;
}

export class Size implements ISize {
  public readonly width: number;
  public readonly height: number;
  public constructor(width: number, height: number) {
    if (width <= 0) {
      throw new Error('Width should be greater tnan 0.');
    }

    this.width = width;

    if (height <= 0) {
      throw new Error('Height should be greater than 0.');
    }

    this.height = height;
  }
}

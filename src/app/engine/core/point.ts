export interface IPoint {
  readonly x: number;
  readonly y: number;
}

export class Point implements IPoint {
  public readonly x: number;
  public readonly y: number;
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

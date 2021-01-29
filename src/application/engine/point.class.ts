export class Point {
  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }

  private _x: number;

  private _y: number;
}

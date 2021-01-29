export class Size {
  public static minWidth = 1;

  public static minHeight = 1;

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public constructor(width = Size.minWidth, height = Size.minHeight) {
    this.setWidth(width);
    this.setHeight(height);
  }

  private _width: number;

  private _height: number;

  private setWidth(value: number): void {
    if (value < Size.minWidth) {
      throw new Error(`Width cannot be less than ${Size.minWidth}.`);
    }

    this._width = value;
  }

  private setHeight(value: number): void {
    if (value < Size.minHeight) {
      throw new Error(`Height cannot be less than ${Size.minHeight}.`);
    }

    this._height = value;
  }
}

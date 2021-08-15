import { Point } from './point';
import { Size } from './size';

export class GameScreen {
  public get sizeInUnits(): Size {
    return this._sizeInUnits;
  }

  public get sizeInPixels(): Size {
    return this._sizeInPixels;
  }

  public get adjustedSizeInPixels(): Size {
    return this._adjustedSizeInPixels;
  }

  public get xIndent(): number {
    return this._xIndent;
  }

  public get yIndent(): number {
    return this._yIndent;
  }

  public get xMultiplier(): number {
    return this._xMultiplier;
  }

  public get yMultiplier(): number {
    return this._yMultiplier;
  }

  public constructor(sizeInUnits: Size, sizeInPixels: Size) {
    this.setSizeInUnits(sizeInUnits);
    this.setSizeInPixels(sizeInPixels);
    this.recalculate();
  }

  public changeSizeInPixels(sizeInPixels: Size): void {
    this.setSizeInPixels(sizeInPixels);
    this.recalculate();
  }

  public castUnitPointToPixel(pointInUnits: Point): Point {
    if (!pointInUnits) {
      throw new Error('Point in units is not defined.');
    }

    const { xIndent, yIndent, xMultiplier, yMultiplier } = this;

    return new Point(pointInUnits.x * xMultiplier + xIndent, pointInUnits.y * yMultiplier + yIndent);
  }

  public castUnitSizeToPixel(sizeInUnits: Size): Size {
    if (!sizeInUnits) {
      throw new Error('Size in units is not defined.');
    }

    const { xMultiplier, yMultiplier } = this;

    return new Size(sizeInUnits.width * xMultiplier, sizeInUnits.height * yMultiplier);
  }

  private _sizeInUnits: Size;

  private _sizeInPixels: Size;

  private _adjustedSizeInPixels: Size;

  private _xIndent: number;

  private _yIndent: number;

  private _xMultiplier: number;

  private _yMultiplier: number;

  private setSizeInUnits(size: Size): void {
    if (!size) {
      throw new Error('Size in units is not defined.');
    }

    this._sizeInUnits = size;
  }

  private setSizeInPixels(size: Size): void {
    if (!size) {
      throw new Error('Size in pixels is not defined.');
    }

    this._sizeInPixels = size;
  }

  private recalculate(): void {
    const { sizeInUnits, sizeInPixels } = this;

    const adjustedWidth = (sizeInPixels.height * sizeInUnits.width) / sizeInUnits.height;
    if (adjustedWidth <= sizeInPixels.width) {
      this._adjustedSizeInPixels = new Size(adjustedWidth, sizeInPixels.height);

      this._xIndent = (sizeInPixels.width - adjustedWidth) / 2;
      this._yIndent = 0;
    } else {
      const adjustedHeight = (sizeInPixels.width * sizeInUnits.height) / sizeInUnits.width;
      if (adjustedHeight <= sizeInPixels.height) {
        this._adjustedSizeInPixels = new Size(sizeInPixels.width, adjustedHeight);

        this._yIndent = (sizeInPixels.height - adjustedHeight) / 2;
        this._xIndent = 0;
      } else {
        throw new Error('Screen instance cannot calculate resolution for rendering.');
      }
    }

    this._xMultiplier = this._adjustedSizeInPixels.width / sizeInUnits.width;
    this._yMultiplier = this._adjustedSizeInPixels.height / sizeInUnits.height;
  }
}

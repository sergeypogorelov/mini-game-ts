import { IDrawParams, IDrawable } from './interfaces/drawable.interface';

import { IPoint, Point } from './point';
import { ISize, Size } from './size';
import { IImg } from './img';

export interface IRenderParams {
  image: IImg;
  srcPointInPixels: IPoint;
  srcSizeInPixels: ISize;
  destPointInUnits: IPoint;
  destSizeInUnits: ISize;
}

export class Renderer {
  public get sizeInUnits(): ISize {
    return this._sizeInUnits;
  }

  public get sizeInPixels(): ISize {
    return this._sizeInPixels;
  }

  public get adjustedSizeInPixels(): ISize {
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

  public constructor(context: IDrawable, sizeInPixels: ISize, sizeInUnits: ISize) {
    this.setContext(context);
    this.setSizeInPixels(sizeInPixels);
    this.setSizeInUnits(sizeInUnits);
    this.recalculate();
  }

  public changeSizeInPixels(sizeInPixels: ISize): void {
    this.setSizeInPixels(sizeInPixels);
    this.recalculate();
  }

  public changeSizeInUnits(sizeInUnits: ISize): void {
    this.setSizeInUnits(sizeInUnits);
    this.recalculate();
  }

  public castUnitPointToPixel(pointInUnits: IPoint): IPoint {
    if (!pointInUnits) {
      throw new Error('Point in units is not defined.');
    }

    const { xIndent, yIndent, xMultiplier, yMultiplier } = this;

    return new Point(pointInUnits.x * xMultiplier + xIndent, pointInUnits.y * yMultiplier + yIndent);
  }

  public castUnitSizeToPixel(sizeInUnits: ISize): ISize {
    if (!sizeInUnits) {
      throw new Error('Size in units is not defined.');
    }

    const { xMultiplier, yMultiplier } = this;

    return new Size(sizeInUnits.width * xMultiplier, sizeInUnits.height * yMultiplier);
  }

  public castPixelPointToUnit(pointInPixels: IPoint): IPoint {
    if (!pointInPixels) {
      throw new Error('Point in pixels is not defined.');
    }

    const { xIndent, yIndent, xMultiplier, yMultiplier } = this;

    return new Point((pointInPixels.x - xIndent) / xMultiplier, (pointInPixels.y - yIndent) / yMultiplier);
  }

  public castPixelSizeToUnit(sizeInPixels: ISize): ISize {
    if (!sizeInPixels) {
      throw new Error('Size in pixels is not defined.');
    }

    const { xMultiplier, yMultiplier } = this;

    return new Size(sizeInPixels.width / xMultiplier, sizeInPixels.height / yMultiplier);
  }

  public clearContext(): void {
    this._context.clear();
  }

  public render(params: IRenderParams): void {
    if (!params) {
      throw new Error('Render params are not defined.');
    }

    const { image, srcPointInPixels: sp, srcSizeInPixels: ss, destPointInUnits, destSizeInUnits } = params;

    if (!image) {
      throw new Error('Image for rendering is not defined.');
    }

    if (!sp) {
      throw new Error('Source point for rendering is not defined.');
    }

    if (!ss) {
      throw new Error('Source size for rendering is not defined.');
    }

    if (!destPointInUnits) {
      throw new Error('Destination point for rendering is not defined.');
    }

    if (!destSizeInUnits) {
      throw new Error('Destination size for rendering is not defined.');
    }

    const dp = this.castUnitPointToPixel(destPointInUnits);
    const ds = this.castUnitSizeToPixel(destSizeInUnits);

    const drawParams: IDrawParams = { image, srcPoint: sp, srcSize: ss, destPoint: dp, destSize: ds };

    this._context.drawImage(drawParams);
  }

  private _sizeInUnits: ISize;

  private _sizeInPixels: ISize;

  private _adjustedSizeInPixels: ISize;

  private _xIndent: number;

  private _yIndent: number;

  private _xMultiplier: number;

  private _yMultiplier: number;

  private _context: IDrawable;

  private setContext(context: IDrawable): void {
    if (!context) {
      throw new Error('Context for rendering is not defined.');
    }

    this._context = context;
  }

  private setSizeInUnits(size: ISize): void {
    if (!size) {
      throw new Error('Size in units is not defined.');
    }

    this._sizeInUnits = size;
  }

  private setSizeInPixels(size: ISize): void {
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
        throw new Error('Renderer cannot calculate resolution for rendering.');
      }
    }

    this._xMultiplier = this._adjustedSizeInPixels.width / sizeInUnits.width;
    this._yMultiplier = this._adjustedSizeInPixels.height / sizeInUnits.height;
  }
}

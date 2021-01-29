import { RenderingContext } from './rendering-context.interface';

import { Point } from './point.class';
import { Size } from './size.class';
import { RenderingData } from './rendering-data.interface';

export abstract class Entity {
  public get location(): Point {
    return this._location;
  }

  public set location(value: Point) {
    if (!value) {
      throw new Error('Location is not specified.');
    }

    this._location = value;
  }

  public get size(): Size {
    return this._size;
  }

  public set size(value: Size) {
    if (!value) {
      throw new Error('Size is not specified.');
    }

    this._size = value;
  }

  public constructor(point?: Point, size?: Size) {
    if (!point) {
      point = new Point();
    }

    if (!size) {
      size = new Size();
    }

    this.location = point;
    this.size = size;
  }

  public render(context: RenderingContext, mapSize: Size): void {
    if (!context) {
      throw new Error('Rendering context is not defined.');
    }

    if (!mapSize) {
      throw new Error('Map size is not defined.');
    }

    const widthScale = context.width / mapSize.width;
    const heightScale = context.height / mapSize.height;

    const data: RenderingData = {
      sourceTag: '',
      x: this.location.x * widthScale,
      y: this.location.y * heightScale,
      width: this.size.width * widthScale,
      height: this.size.height * heightScale,
    };

    context.draw(data);
  }

  private _location: Point;

  private _size: Size;
}

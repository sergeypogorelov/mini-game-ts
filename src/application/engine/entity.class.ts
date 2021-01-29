import { RenderingContext } from './rendering-context.interface';
import { RenderingData } from './rendering-data.interface';

import { Point } from './point.class';
import { Size } from './size.class';

export abstract class Entity {
  public abstract get imageTag(): string;

  public get coordinates(): Point {
    return this._coordinates;
  }

  public set coordinates(value: Point) {
    if (!value) {
      throw new Error('Location is not specified.');
    }

    this._coordinates = value;
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

  public constructor(coordinates?: Point, size?: Size) {
    if (!coordinates) {
      coordinates = new Point();
    }

    if (!size) {
      size = new Size();
    }

    this.coordinates = coordinates;
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
      imageTag: this.imageTag,
      x: this.coordinates.x * widthScale,
      y: this.coordinates.y * heightScale,
      width: this.size.width * widthScale,
      height: this.size.height * heightScale,
    };

    context.draw(data);
  }

  private _coordinates: Point;

  private _size: Size;
}

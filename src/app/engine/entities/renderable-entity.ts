import { IPoint } from '../point';
import { IRenderable } from '../renderable.interface';
import { ISize } from '../size';
import { IUpdateable } from '../updateable.interface';

import { Entity } from './entity';
import { Renderer } from '../renderer';

export abstract class RenderableEntity extends Entity implements IUpdateable, IRenderable {
  public get location(): IPoint {
    return this._location;
  }

  public set location(value: IPoint) {
    this.setLocation(value);
  }

  public get size(): ISize {
    return this._size;
  }

  public set size(value: ISize) {
    this.setSize(value);
  }

  public abstract update(dt: number): void;

  public abstract render(renderer: Renderer): void;

  private _location: IPoint;

  private _size: ISize;

  private setLocation(location: IPoint): void {
    if (!location) {
      throw new Error('Location is not specified.');
    }

    this._location = location;
  }

  private setSize(size: ISize): void {
    if (!size) {
      throw new Error('Size is not specified.');
    }

    this._size = size;
  }
}

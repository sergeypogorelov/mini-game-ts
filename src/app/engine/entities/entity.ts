import { IUpdateable } from '../core/interfaces/updateable.interface';
import { IRenderable } from '../core/interfaces/renderable.interface';

import { IPoint } from '../core/point';
import { ISize } from '../core/size';

import { Renderer } from '../core/renderer';

export abstract class Entity implements IUpdateable, IRenderable {
  public get location(): IPoint {
    return this._location;
  }

  public get size(): ISize {
    return this._size;
  }

  public constructor(location: IPoint, size: ISize) {
    this.setLocation(location);
    this.setSize(size);
  }

  public abstract update(dt: number): void;

  public abstract render(renderer: Renderer): void;

  protected setLocation(location: IPoint): void {
    if (!location) {
      throw new Error('Location is not specified.');
    }

    this._location = location;
  }

  protected setSize(size: ISize): void {
    if (!size) {
      throw new Error('Size is not specified.');
    }

    this._size = size;
  }

  private _location: IPoint;

  private _size: ISize;
}

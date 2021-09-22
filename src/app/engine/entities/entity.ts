import { IUpdateable } from '../core/interfaces/updateable.interface';
import { IRenderable } from '../core/interfaces/renderable.interface';
import { IDestroyable } from '../core/interfaces/destroyable.interface';

import { IPoint } from '../core/point';
import { ISize } from '../core/size';

import { EventEmitter } from '../core/event-emmiter';
import { Renderer } from '../core/renderer';

export abstract class Entity implements IUpdateable, IRenderable, IDestroyable {
  public readonly onDisposalReady = new EventEmitter<void>();

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

  public abstract destroy(): void;

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

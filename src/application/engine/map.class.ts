import { Entity } from './entity.class';
import { RenderingContext } from './rendering-context.interface';
import { Size } from './size.class';

export abstract class Map {
  public get size(): Size {
    return this._size;
  }

  public get entities(): Entity[] {
    return this._entities;
  }

  public constructor(size: Size) {
    if (!size) {
      throw new Error('Map size is not defined.');
    }

    this._size = size;
  }

  public render(context: RenderingContext): void {
    if (!context) {
      throw new Error('Rendering context is not defined.');
    }

    this.entities.forEach((entity) => entity.render(context, this.size));
  }

  private _size: Size;

  private _entities: Entity[] = [];
}

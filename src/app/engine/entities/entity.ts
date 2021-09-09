import { IUpdateable } from '../updateable.interface';

export abstract class Entity implements IUpdateable {
  public abstract update(dt: number): void;
}

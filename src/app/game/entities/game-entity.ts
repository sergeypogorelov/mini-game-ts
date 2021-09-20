import { IPoint } from '../../engine/core/point';
import { ISize, Size } from '../../engine/core/size';

import { Entity } from '../../engine/entities/entity';

export enum GameEntityTypes {
  Crystal = 'crystal',
  EmptyCell = 'empty-cell',
}

export abstract class GameEntity extends Entity {
  public static readonly defSize: ISize = new Size(5, 5);

  public get type(): GameEntityTypes {
    return this._type;
  }

  public constructor(type: GameEntityTypes, location: IPoint, size: ISize) {
    super(location, size);

    this.setType(type);
  }

  public abstract checkSwap(entity: GameEntity): boolean;

  public changeLocation(newLocation: IPoint): void {
    this.setLocation(newLocation);
  }

  private _type: GameEntityTypes;

  private setType(type: GameEntityTypes): void {
    if (!type) {
      throw new Error('Type is not specified.');
    }

    this._type = type;
  }
}

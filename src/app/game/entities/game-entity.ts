import { IPoint } from '../../engine/core/point';
import { ISize, Size } from '../../engine/core/size';

import { Entity } from '../../engine/entities/entity';

export enum GameEntityTypes {
  Crystal = 'crystal',
  EmptyCell = 'empty-cell',
}

export abstract class GameEntity extends Entity {
  public static readonly defSize: ISize = new Size(5, 5);

  public static readonly closestEntitiesPredicates: ((e1: GameEntity, e2: GameEntity) => boolean)[] = [
    /// e2
    /// e1
    ///
    (e1: GameEntity, e2: GameEntity): boolean => {
      return e1.location.x === e2.location.x && e1.location.y - GameEntity.defSize.height === e2.location.y;
    },
    ///
    /// e1 e2
    ///
    (e1: GameEntity, e2: GameEntity): boolean => {
      return e1.location.x + GameEntity.defSize.width === e2.location.x && e1.location.y === e2.location.y;
    },
    ///
    /// e1
    /// e2
    (e1: GameEntity, e2: GameEntity): boolean => {
      return e1.location.x === e2.location.x && e1.location.y + GameEntity.defSize.height === e2.location.y;
    },
    ///
    /// e2 e1
    ///
    (e1: GameEntity, e2: GameEntity): boolean => {
      return e1.location.x - GameEntity.defSize.width === e2.location.x && e1.location.y === e2.location.y;
    },
  ];

  public get type(): GameEntityTypes {
    return this._type;
  }

  public constructor(type: GameEntityTypes, location: IPoint, size: ISize) {
    super(location, size);

    this.setType(type);
  }

  public checkNeighbor(entity: GameEntity): boolean {
    if (!entity) {
      throw new Error('Entity is not specified.');
    }

    for (const predicate of GameEntity.closestEntitiesPredicates) {
      if (predicate(this, entity)) {
        return true;
      }
    }

    return false;
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

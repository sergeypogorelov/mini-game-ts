import { IPoint } from '../../engine/core/point';
import { Renderer } from '../../engine/core/renderer';

import { GameEntity, GameEntityTypes } from './game-entity';

export class EmptyCell extends GameEntity {
  public constructor(location: IPoint) {
    super(GameEntityTypes.EmptyCell, location, EmptyCell.defSize);
  }

  public update(dt: number): void {
    /// nothing to update
  }

  public render(renderer: Renderer): void {
    /// nothing to render
  }

  public checkSwap(entity: GameEntity): boolean {
    if (!entity) {
      throw new Error('Entity is not specified.');
    }

    return false;
  }
}

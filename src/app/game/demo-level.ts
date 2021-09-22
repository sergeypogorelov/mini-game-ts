import {
  crystalBlueSpriteUrl,
  crystalGreenSpriteUrl,
  crystalGreySpriteUrl,
  crystalRedSpriteUrl,
  explosionSpriteUrl,
  levelDemoImgUrl,
  explosionSpriteFrames,
} from '../../assets';

import { IPoint, Point } from '../engine/core/point';
import { IImg } from '../engine/core/img';
import { Size } from '../engine/core/size';

import { EventEmitter } from '../engine/core/event-emmiter';
import { IRenderParams, Renderer } from '../engine/core/renderer';
import { Utils } from '../engine/core/utils';

import { AssetsManager } from '../engine/assets-manager';
import { Level } from '../engine/level';

import { GameEntity, GameEntityTypes } from './entities/game-entity';
import { Crystal, CrystalColors } from './entities/crystal';
import { EmptyCell } from './entities/empty-cell';

export interface IDemoLevelMatrixData {
  matrixLength: number;
  matrtixWidth: number;
  matrixHeight: number;
  xIndent: number;
  yIndent: number;
  yIndentForMatrix: number;
}

export class DemoLevel extends Level {
  public static readonly defSize = new Size(70, 40);

  public constructor(assetsManager: AssetsManager) {
    super(assetsManager, DemoLevel.defSize);

    this.setEventHandlers();
  }

  public update(dt: number): void {
    this._targetCrystals.forEach((crystal) => {
      crystal.update(dt);
    });

    this._entities.forEach((entity) => {
      entity.update(dt);
    });
  }

  public render(renderer: Renderer): void {
    renderer.clearContext();

    this.renderBackground(renderer);
    this.renderEntities(renderer);
  }

  public touch(pointInUnits: IPoint): void {
    const touchedEntity = this._entities.find((entity) => {
      const { location, size } = entity;
      return Utils.checkTouch(pointInUnits, location, size);
    });

    if (touchedEntity) {
      this._onTouch.emit(touchedEntity);
    } else {
      this._onFailedTouch.emit();
    }
  }

  protected imageIds: string[] = [
    levelDemoImgUrl,
    crystalRedSpriteUrl,
    crystalGreenSpriteUrl,
    crystalBlueSpriteUrl,
    crystalGreySpriteUrl,
    explosionSpriteUrl,
  ];

  protected loadEntities(): Promise<void> {
    this._bgImg = this.assetsManager.getImage(levelDemoImgUrl);

    const targetCrystals: Crystal[] = [];
    const entities: GameEntity[] = [];

    const targetColors = this.getColors();
    const crystals = this.generateCrystals();

    const { matrixLength, xIndent, yIndent, yIndentForMatrix } = this.getMatrixData();

    for (let i = 0; i < matrixLength; i += 2) {
      const location = new Point(i * GameEntity.defSize.width + xIndent, yIndent);

      const color = targetColors.pop();
      const crystal = this.createCrystal(location, color);
      crystal.spriteAnimation.setFramesOrder(false);

      targetCrystals.push(crystal);
    }

    for (let i = 0; i < matrixLength; i++) {
      const { width, height } = GameEntity.defSize;

      for (let j = 0; j < matrixLength; j++) {
        const newLocation = new Point(j * width + xIndent, i * height + yIndent + height + yIndentForMatrix);

        if (j % 2 === 0) {
          const crystal = crystals.pop();
          crystal.changeLocation(newLocation);

          entities.push(crystal);
        } else {
          if (i % 2 === 0) {
            const crystal = this.createCrystal(newLocation, CrystalColors.Grey);
            entities.push(crystal);
          } else {
            const emptyCell = new EmptyCell(newLocation);
            entities.push(emptyCell);
          }
        }
      }
    }

    this._targetCrystals = targetCrystals;
    this._entities = entities;

    return Promise.resolve();
  }

  private _onTouch: EventEmitter<GameEntity>;

  private _onFailedTouch: EventEmitter<void>;

  private _onSwapCheck: EventEmitter<GameEntity>;

  private _onSwap: EventEmitter<void>;

  private _touchedCrystal: Crystal;

  private _targetCrystals: Crystal[];

  private _entities: GameEntity[];

  private _bgImg: IImg;

  private getColors(mix = true): CrystalColors[] {
    const colors: CrystalColors[] = [CrystalColors.Red, CrystalColors.Green, CrystalColors.Blue];
    if (mix) {
      return colors.sort(() => Utils.getRandomInteger(-1, 1));
    }
    return colors;
  }

  private getMatrixData(): IDemoLevelMatrixData {
    const matrixLength = 2 * this.getColors().length - 1;

    const yIndentForMatrix = GameEntity.defSize.height * 0.5;
    const matrtixWidth = matrixLength * GameEntity.defSize.width;
    const matrixHeight = matrixLength * GameEntity.defSize.height + GameEntity.defSize.height + yIndentForMatrix;

    const xIndent = Math.floor((this.size.width - matrtixWidth) / 2);
    const yIndent = Math.floor((this.size.height - matrixHeight) / 2);

    return {
      matrixLength,
      matrtixWidth,
      matrixHeight,
      xIndent,
      yIndent,
      yIndentForMatrix,
    };
  }

  private renderBackground(renderer: Renderer): void {
    if (!renderer) {
      throw new Error('Renderer is not specified.');
    }

    const params: IRenderParams = {
      image: this._bgImg,
      srcPointInPixels: new Point(0, 0),
      srcSizeInPixels: this._bgImg.size,
      destPointInUnits: new Point(0, 0),
      destSizeInUnits: this.size,
    };

    renderer.render(params);
  }

  private renderEntities(renderer: Renderer): void {
    if (!renderer) {
      throw new Error('Renderer is not specified.');
    }

    this._targetCrystals.forEach((crystal) => {
      crystal.render(renderer);
    });

    this._entities.forEach((entity) => {
      entity.render(renderer);
    });
  }

  private generateCrystals(): Crystal[] {
    const crystals: Crystal[] = [];

    const colors: CrystalColors[] = this.getColors(false);

    const countOfColors = colors.length;
    const countOfCrystalsPerColor = 2 * countOfColors - 1;

    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];

      for (let j = 0; j < countOfCrystalsPerColor; j++) {
        const crystal = this.createCrystal(new Point(0, 0), color);
        crystals.push(crystal);
      }
    }

    return crystals.sort(() => Utils.getRandomInteger(-1, 1));
  }

  private createCrystal(location: IPoint, color: CrystalColors): Crystal {
    if (!location) {
      throw new Error('Crystal location is not specified.');
    }

    if (!color) {
      throw new Error('Crystal color is not specified.');
    }

    const spriteUrlPerColorMap = Crystal.spriteUrlPerColorMap;
    const spriteFramesPerColorMap = Crystal.spriteFramesPerColorMap;

    const spriteImage = this.assetsManager.getImage(spriteUrlPerColorMap.get(color));
    const spriteFrames = spriteFramesPerColorMap.get(color);

    const explosionSpriteImage = this.assetsManager.getImage(explosionSpriteUrl);

    return new Crystal({
      spriteImage,
      spriteFrames,
      explosionSpriteImage,
      explosionSpriteFrames,
      color,
      location,
    });
  }

  private checkIfRiddleIsSolved(): boolean {
    const { width: entityWidth, height: entityHeight } = GameEntity.defSize;
    const { matrixLength, xIndent, yIndent, yIndentForMatrix } = this.getMatrixData();

    const matrix: GameEntity[][] = [];

    this._entities.forEach((entity) => {
      const { x, y } = entity.location;

      const i = (y - yIndent - yIndentForMatrix - entityHeight) / entityHeight;
      const j = (x - xIndent) / entityWidth;

      if (!matrix[j]) {
        matrix[j] = [];
      }

      matrix[j][i] = entity;
    });

    const targetCrystals = this._targetCrystals.slice();

    for (let i = 0; i < matrixLength; i += 2) {
      const requiredCrystal = targetCrystals.shift();
      const requiredColor = requiredCrystal.color;

      const isColumnValid = matrix[i].every((entity) => {
        if (entity.type !== GameEntityTypes.Crystal) {
          return false;
        }

        const crystal = entity as Crystal;
        return crystal.color === requiredColor;
      });

      if (!isColumnValid) {
        return false;
      }
    }

    return true;
  }

  private setEventHandlers(): void {
    this._onTouch = new EventEmitter<GameEntity>();
    this._onFailedTouch = new EventEmitter<void>();
    this._onSwapCheck = new EventEmitter<GameEntity>();
    this._onSwap = new EventEmitter<void>();

    this._onTouch.attach((entity) => {
      if (this._touchedCrystal) {
        this._onSwapCheck.emit(entity);
      } else if (entity.type === GameEntityTypes.Crystal) {
        const crystal = entity as Crystal;
        crystal.freeze();

        this._touchedCrystal = crystal;
      } else {
        this._onFailedTouch.emit();
      }
    });

    this._onFailedTouch.attach(() => {
      const crystal = this._touchedCrystal;

      if (crystal) {
        crystal.unfreeze();
        this._touchedCrystal = null;
      }
    });

    this._onSwapCheck.attach((entity) => {
      const crystal = this._touchedCrystal;

      if (crystal.checkSwap(entity)) {
        const crystalLocation = crystal.location;
        crystal.changeLocation(entity.location);
        entity.changeLocation(crystalLocation);

        this._onSwap.emit();
      }

      this._onFailedTouch.emit();
    });

    this._onSwap.attach(() => {
      if (this.checkIfRiddleIsSolved()) {
        this.onVictory.emit();

        const allEntities = [...this._entities, ...this._targetCrystals];

        allEntities.forEach((entity) => {
          entity.onDisposalReady.attach(() => {
            this._targetCrystals = this._targetCrystals.filter((e) => e !== entity);
            this._entities = this._entities.filter((e) => e !== entity);
          });

          entity.destroy();
        });
      }
    });
  }
}

import {
  crystalBlueSpriteFrames,
  crystalBlueSpriteUrl,
  crystalGreenSpriteFrames,
  crystalGreenSpriteUrl,
  crystalGreySpriteFrames,
  crystalGreySpriteUrl,
  crystalRedSpriteFrames,
  crystalRedSpriteUrl,
  levelDemoImgUrl,
} from '../../assets';

import { IPoint, Point } from '../engine/core/point';
import { IImg } from '../engine/core/img';
import { Size } from '../engine/core/size';

import { IRenderParams, Renderer } from '../engine/core/renderer';
import { Utils } from '../engine/core/utils';

import { AssetsManager } from '../engine/assets-manager';
import { Level } from '../engine/level';

import { GameEntity, GameEntityTypes } from './entities/game-entity';
import { Crystal, CrystalColor } from './entities/crystal';
import { EmptyCell } from './entities/empty-cell';

export class DemoLevel extends Level {
  public constructor(assetsManager: AssetsManager) {
    super(assetsManager, new Size(70, 40));
  }

  public update(dt: number): void {
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
    this._entities.forEach((entity) => {
      if (entity.type !== GameEntityTypes.Crystal) {
        return;
      }

      const crystal = entity as Crystal;
      if (crystal.color === CrystalColor.Grey) {
        return;
      }

      if (Utils.checkTouch(pointInUnits, crystal.location, crystal.size)) {
        crystal.freeze();
      } else {
        crystal.unfreeze();
      }
    });
  }

  protected imageIds: string[] = [
    levelDemoImgUrl,
    crystalRedSpriteUrl,
    crystalGreenSpriteUrl,
    crystalBlueSpriteUrl,
    crystalGreySpriteUrl,
  ];

  protected loadEntities(): Promise<void> {
    this._bgImg = this.assetsManager.getImage(levelDemoImgUrl);

    const entities: GameEntity[] = [];
    const crystals = this.generateCrystals();
    const targetColors = this.generateTargetColors();

    const matrixLength = 2 * targetColors.length - 1;

    for (let i = 0; i < matrixLength; i++) {
      const { width, height } = GameEntity.defSize;

      for (let j = 0; j < matrixLength; j++) {
        const newLocation = new Point(j * width, i * height);

        if (j % 2 === 0) {
          const crystal = crystals.pop();
          crystal.changeLocation(newLocation);

          entities.push(crystal);
        } else {
          if (i % 2 === 0) {
            const crystal = this.createCrystal(newLocation, CrystalColor.Grey);
            entities.push(crystal);
          } else {
            const emptyCell = new EmptyCell(newLocation);
            entities.push(emptyCell);
          }
        }
      }
    }

    this._targetColors = targetColors;
    this._entities = entities;

    return Promise.resolve();
  }

  private _targetColors: CrystalColor[];

  private _entities: GameEntity[];

  private _bgImg: IImg;

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

    this._entities.forEach((entity) => {
      entity.render(renderer);
    });
  }

  private generateTargetColors(): CrystalColor[] {
    const colors: CrystalColor[] = [CrystalColor.Red, CrystalColor.Green, CrystalColor.Blue];
    return colors.sort(() => Utils.getRandomInteger(-1, 1));
  }

  private generateCrystals(): Crystal[] {
    const crystals: Crystal[] = [];

    const colors: CrystalColor[] = this.generateTargetColors();

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

  private createCrystal(location: IPoint, color: CrystalColor): Crystal {
    if (!location) {
      throw new Error('Crystal location is not specified.');
    }

    if (!color) {
      throw new Error('Crystal color is not specified.');
    }

    const spriteUrlPerColorMap = new Map<CrystalColor, string>([
      [CrystalColor.Grey, crystalGreySpriteUrl],
      [CrystalColor.Red, crystalRedSpriteUrl],
      [CrystalColor.Green, crystalGreenSpriteUrl],
      [CrystalColor.Blue, crystalBlueSpriteUrl],
    ]);

    const spriteFramesPerColorMap = new Map<CrystalColor, number[][]>([
      [CrystalColor.Grey, crystalGreySpriteFrames],
      [CrystalColor.Red, crystalRedSpriteFrames],
      [CrystalColor.Green, crystalGreenSpriteFrames],
      [CrystalColor.Blue, crystalBlueSpriteFrames],
    ]);

    const spriteImage = this.assetsManager.getImage(spriteUrlPerColorMap.get(color));
    const spriteFrames = spriteFramesPerColorMap.get(color);

    return new Crystal({
      spriteImage,
      spriteFrames,
      color,
      location,
    });
  }
}

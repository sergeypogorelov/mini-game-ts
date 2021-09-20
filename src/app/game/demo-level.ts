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

import { Crystal, CrystalColor } from './entities/crystal';

export class DemoLevel extends Level {
  public constructor(assetsManager: AssetsManager) {
    super(assetsManager, new Size(70, 40));
  }

  public update(dt: number): void {
    this._crystal.update(dt);
  }

  public render(renderer: Renderer): void {
    renderer.clearContext();

    this.renderBackground(renderer);
    this.renderEntities(renderer);
  }

  public touch(pointInUnits: IPoint): void {
    const crystal = this._crystal;

    if (Utils.checkTouch(pointInUnits, crystal.location, crystal.size)) {
      crystal.freeze();
    } else {
      crystal.unfreeze();
    }
  }

  protected imageIds: string[] = [
    levelDemoImgUrl,
    crystalRedSpriteUrl,
    crystalGreenSpriteUrl,
    crystalBlueSpriteUrl,
    crystalGreySpriteUrl,
  ];

  protected loadEntities(): Promise<void> {
    this._backgroundImg = this.assetsManager.getImage(levelDemoImgUrl);
    this._crystal = this.createCrystal(new Point(0, 0), CrystalColor.Blue);

    return Promise.resolve();
  }

  private _crystal: Crystal;

  private _backgroundImg: IImg;

  private renderBackground(renderer: Renderer): void {
    if (!renderer) {
      throw new Error('Renderer is not specified.');
    }

    const params: IRenderParams = {
      image: this._backgroundImg,
      srcPointInPixels: new Point(0, 0),
      srcSizeInPixels: this._backgroundImg.size,
      destPointInUnits: new Point(0, 0),
      destSizeInUnits: this.size,
    };

    renderer.render(params);
  }

  private renderEntities(renderer: Renderer): void {
    if (!renderer) {
      throw new Error('Renderer is not specified.');
    }

    this._crystal.render(renderer);
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

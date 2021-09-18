import { crystalYellowSpriteUrl, levelDemoImgUrl } from '../../assets';
import { AssetsManager } from '../engine/assets-manager';
import { IImg } from '../engine/core/img';
import { Point } from '../engine/core/point';
import { IRenderParams, Renderer } from '../engine/core/renderer';
import { Size } from '../engine/core/size';
import { Level } from '../engine/level';
import { Crystal } from './crystal';

export class DemoLevel extends Level {
  public constructor(assetsManager: AssetsManager) {
    super(assetsManager, new Size(700, 400));
  }

  public update(dt: number): void {
    this._crystal.update(dt);
  }

  public render(renderer: Renderer): void {
    const params: IRenderParams = {
      image: this._backgroundImg,
      srcPointInPixels: new Point(0, 0),
      srcSizeInPixels: this._backgroundImg.size,
      destPointInUnits: new Point(0, 0),
      destSizeInUnits: this.size,
    };

    renderer.render(params);

    this._crystal.render(renderer);
  }

  protected loadEntities(): Promise<void> {
    this._backgroundImg = this.assetsManager.getImage(levelDemoImgUrl);

    const img = this.assetsManager.getImage(crystalYellowSpriteUrl);
    this._crystal = new Crystal(img, new Point(0, 0), new Size(32, 32));

    return Promise.resolve();
  }

  private _crystal: Crystal;

  private _backgroundImg: IImg;
}

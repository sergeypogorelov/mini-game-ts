import { RenderingContext } from '../../../../engine/rendering-context.interface';

import { ImageTags } from '../../../../game/image-tags.enum';
import { TestMap } from '../../../../game/test-map.class';

import { ResourceLoadRequest } from '../../../common/resource-loader/resource-load-request.interface';
import { ResourceLoader } from '../../../common/resource-loader/resource-loader.class';
import { AssetPathes } from '../../../common/asset-pathes/asset-pathes.class';
import { View } from '../../../common/view/view.class';

import { CanvasConfig } from './canvas-config.class';

export class CanvasView extends View<HTMLCanvasElement> {
  public constructor(cfg?: CanvasConfig) {
    super(document.createElement('canvas'));

    this.initConfig(cfg);

    this.initHost();
    this.initContext();
  }

  public fillFullRect(fillStyle: string): void {
    if (!fillStyle) {
      throw new Error('Fill style is not defined.');
    }

    this._context.fillStyle = fillStyle;
    this._context.fillRect(0, 0, this._cfg.width, this._cfg.height);
  }

  public drawEntity(): void {
    const imgUrl = AssetPathes.getImagePathByTag(ImageTags.Test);
    const loadRequest: ResourceLoadRequest = {
      imageUrls: [imgUrl],
    };

    ResourceLoader.getInstance()
      .load(loadRequest)
      .then((result) => {
        const map = new TestMap();
        const element = result.images[0].content;

        const context: RenderingContext = {
          width: this._cfg.width,
          height: this._cfg.height,
          draw: (data) => {
            this._context.drawImage(
              element,
              0,
              0,
              element.width,
              element.height,
              data.x,
              data.y,
              data.width,
              data.height,
            );
          },
        };

        map.render(context);
      })
      .catch((err) => console.error(err));
  }

  private _cfg: CanvasConfig;

  private _context: CanvasRenderingContext2D;

  private initConfig(cfg?: CanvasConfig): void {
    if (!cfg) {
      cfg = CanvasConfig.generateDefault();
    }

    this._cfg = cfg.clone();
  }

  private initHost(): void {
    this.host.width = this._cfg.width;
    this.host.height = this._cfg.height;
  }

  private initContext(): void {
    this._context = this.host.getContext('2d');
  }
}

import { Img } from '../engine/core/img';
import { Size } from '../engine/core/size';
import { DemoAssetsManager } from '../game/demo-assets-manager';
import { IResourceLoadRequest } from './resource-loader/resource-load-request.interface';
import { ResourceLoader } from './resource-loader/resource-loader';

export class WebDemoAssetsManager extends DemoAssetsManager {
  public get isLoaded(): boolean {
    return this._isLoaded;
  }

  public async load(): Promise<void> {
    const req: IResourceLoadRequest = {
      imageUrls: this.imageIds,
    };

    const res = await ResourceLoader.getInstance().load(req);

    if (!this._imageElementStoreMap) {
      this._imageElementStoreMap = new Map<string, HTMLImageElement>();
    }

    res.images.forEach((item) => {
      this._imageElementStoreMap.set(item.url, item.element);

      this.imageStoreMap.set(item.url, new Img(item.url, new Size(item.element.width, item.element.height)));
    });
  }

  public getImageElement(id: string): HTMLImageElement {
    return this._imageElementStoreMap.get(id);
  }

  private _isLoaded: boolean;

  private _imageElementStoreMap: Map<string, HTMLImageElement>;
}

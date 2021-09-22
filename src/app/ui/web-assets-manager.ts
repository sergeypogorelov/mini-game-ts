import { AssetsManager } from '../engine/assets-manager';
import { Img } from '../engine/core/img';
import { Size } from '../engine/core/size';
import { IResourceLoadRequest } from './resource-loader/resource-load-request.interface';
import { IResourceLoadResult } from './resource-loader/resource-load-result.interface';
import { ResourceLoader } from './resource-loader/resource-loader';

export class WebAssetsManager extends AssetsManager {
  public get isLoading(): boolean {
    return this._isLoading;
  }

  public getImageElement(id: string): HTMLImageElement {
    return this._imageElementStoreMap.get(id);
  }

  public async load(imageIds: string[]): Promise<void> {
    if (!imageIds) {
      throw new Error('Image ids are not specified.');
    }

    const req: IResourceLoadRequest = {
      imageUrls: imageIds,
    };

    let res: IResourceLoadResult;

    try {
      this._isLoading = true;

      res = await ResourceLoader.getInstance().load(req);
    } catch (e) {
      throw e;
    } finally {
      this._isLoading = false;
    }

    if (!this._imageElementStoreMap) {
      this._imageElementStoreMap = new Map<string, HTMLImageElement>();
    }

    res.images.forEach((imageResultItem) => {
      const { url, element } = imageResultItem;

      this._imageElementStoreMap.set(url, element);

      this.imageStoreMap.set(url, new Img(url, new Size(element.width, element.height)));
    });
  }

  private _isLoading: boolean;

  private _imageElementStoreMap: Map<string, HTMLImageElement>;
}

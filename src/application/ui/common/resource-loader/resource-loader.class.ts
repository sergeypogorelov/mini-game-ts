import { ResourceLoadRequest } from './resource-load-request.interface';
import { ResourceLoadResult } from './resource-load-result.interface';

import { ImageLoader } from './image-loader/image-loader.class';

export class ResourceLoader {
  public static getInstance(): ResourceLoader {
    if (!ResourceLoader._instance) {
      ResourceLoader._instance = new ResourceLoader();
    }

    return ResourceLoader._instance;
  }

  public get loading(): boolean {
    return this._imageLoader.loading;
  }

  public load(request: ResourceLoadRequest): Promise<ResourceLoadResult> {
    if (!request) {
      throw new Error('Request for loading resources is not specified.');
    }

    if (this.loading) {
      throw new Error('Loading is already in progress.');
    }

    return new Promise<ResourceLoadResult>((resolve, reject) => {
      const promises = [this._imageLoader.load(request.imageUrls ?? [])];

      Promise.all(promises)
        .then(([imageResults]) => {
          const result: ResourceLoadResult = {
            images: (request.imageUrls ?? []).map((url, index) => ({ url, content: imageResults[index] })),
          };

          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }

  private static _instance: ResourceLoader;

  private _imageLoader = new ImageLoader();

  private constructor() {
    /// hide constructor as this class is a singleton
  }
}

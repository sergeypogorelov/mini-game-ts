import { IResourceLoadRequest } from './resource-load-request.interface';
import { IResourceLoadResult } from './resource-load-result.interface';

import { AudioLoader } from './audio-loader';
import { ImageLoader } from './image-loader';

export class ResourceLoader {
  public static getInstance(): ResourceLoader {
    if (!ResourceLoader._instance) {
      ResourceLoader._instance = new ResourceLoader();
    }

    return ResourceLoader._instance;
  }

  public get loading(): boolean {
    return this._imageLoader.loading || this._audioLoader.loading;
  }

  public load(request: IResourceLoadRequest): Promise<IResourceLoadResult> {
    if (!request) {
      throw new Error('Request for loading resources is not specified.');
    }

    if (this.loading) {
      throw new Error('Loading is already in progress.');
    }

    return new Promise<IResourceLoadResult>((resolve, reject) => {
      const promises: [Promise<HTMLImageElement[]>, Promise<HTMLAudioElement[]>] = [
        this._imageLoader.load(request.imageUrls ?? []),
        this._audioLoader.load(request.audioUrls ?? []),
      ];

      Promise.all(promises)
        .then(([imageResults, audioResults]) => {
          const result: IResourceLoadResult = {
            images: (request.imageUrls ?? []).map((url, index) => ({ url, element: imageResults[index] })),
            sounds: (request.audioUrls ?? []).map((url, index) => ({ url, element: audioResults[index] })),
          };

          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }

  private static _instance: ResourceLoader;

  private _imageLoader = new ImageLoader();

  private _audioLoader = new AudioLoader();

  private constructor() {
    /// hide constructor as this class is a singleton
  }
}

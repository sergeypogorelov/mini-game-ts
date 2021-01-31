import { ResourceLoadRequest } from './resource-load-request.interface';
import { ResourceLoadResult } from './resource-load-result.interface';

import { ImageLoader } from './image-loader/image-loader.class';
import { AudioLoader } from './audio-loader/audio-loader.class';

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

  public load(request: ResourceLoadRequest): Promise<ResourceLoadResult> {
    if (!request) {
      throw new Error('Request for loading resources is not specified.');
    }

    if (this.loading) {
      throw new Error('Loading is already in progress.');
    }

    return new Promise<ResourceLoadResult>((resolve, reject) => {
      const promises: [Promise<HTMLImageElement[]>, Promise<HTMLAudioElement[]>] = [
        this._imageLoader.load(request.imageUrls ?? []),
        this._audioLoader.load(request.audioUrls ?? []),
      ];

      Promise.all(promises)
        .then(([imageResults, audioResults]) => {
          const result: ResourceLoadResult = {
            images: (request.imageUrls ?? []).map((url, index) => ({ url, content: imageResults[index] })),
            sounds: (request.audioUrls ?? []).map((url, index) => ({ url, content: audioResults[index] })),
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

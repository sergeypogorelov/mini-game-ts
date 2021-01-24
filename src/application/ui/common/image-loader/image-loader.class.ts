import { PromiseExecutor } from '../../../core/promise-executor/promise-executor.type';

import { SyncEvent } from '../../../core/sync-event-emitter/sync-event.interface';
import { SyncEventEmitter } from '../../../core/sync-event-emitter/sync-event-emitter.class';

export class ImageLoader {
  public get onGlobalLoadStart(): SyncEvent<void> {
    return this._onGlobalLoadStart.asEvent();
  }

  public get onGlobalLoadEnd(): SyncEvent<void> {
    return this._onGlobalLoadEnd.asEvent();
  }

  public load(url: string): Promise<HTMLImageElement> {
    if (!url) {
      throw new Error('Url is not defined.');
    }

    if (this._currentLoadsMap.size === 0) {
      this._onGlobalLoadStart.emit();
    }

    if (this._currentLoadsMap.has(url)) {
      return this._currentLoadsMap.get(url);
    }

    const promise = new Promise<HTMLImageElement>(this.getLoadPromiseExecutor(url));

    this._currentLoadsMap.set(url, promise);

    return promise;
  }

  private _currentLoadsMap = new Map<string, Promise<HTMLImageElement>>();

  private _onGlobalLoadStart = new SyncEventEmitter<void>();

  private _onGlobalLoadEnd = new SyncEventEmitter<void>();

  private getLoadPromiseExecutor(url: string): PromiseExecutor<HTMLImageElement> {
    if (!url) {
      throw new Error('Url is not defined.');
    }

    return (resolve, reject) => {
      const imageElement = new Image();

      imageElement.onload = () => {
        resolve(imageElement);
        this.handleImageLoad(url, imageElement);
      };

      imageElement.onerror = (ev: ErrorEvent) => {
        reject(ev);
        this.handleImageLoad(url, imageElement);
      };

      imageElement.style.display = 'none';
      imageElement.src = url;

      document.body.appendChild(imageElement);
    };
  }

  private handleImageLoad(url: string, imageElement: HTMLImageElement): void {
    if (!url) {
      throw new Error('Url is not defined.');
    }

    if (!imageElement) {
      throw new Error('Image element is not defined.');
    }

    document.body.removeChild(imageElement);
    imageElement.removeAttribute('style');

    this._currentLoadsMap.delete(url);
    if (this._currentLoadsMap.size === 0) {
      this._onGlobalLoadEnd.emit();
    }
  }
}

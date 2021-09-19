import { AssetsManager } from './assets-manager';
import { EventEmitter } from './core/event-emmiter';
import { IRenderable } from './core/interfaces/renderable.interface';
import { IUpdateable } from './core/interfaces/updateable.interface';
import { Renderer } from './core/renderer';
import { ISize } from './core/size';

export abstract class Level implements IUpdateable, IRenderable {
  public readonly onVictory = new EventEmitter<void>();

  public readonly onDefeat = new EventEmitter<void>();

  public get isLoaded(): boolean {
    return this._isLoaded;
  }

  public get size(): ISize {
    return this._size;
  }

  public get assetsManager(): AssetsManager {
    return this._assetsManager;
  }

  public constructor(assetsManager: AssetsManager, size: ISize) {
    this.setAssetsManager(assetsManager);
    this.setSize(size);
  }

  public abstract update(dt: number): void;

  public abstract render(renderer: Renderer): void;

  public async load(): Promise<Level> {
    this._isLoaded = false;

    await this.assetsManager.load(this.imageIds);
    await this.loadEntities();

    this._isLoaded = true;

    return this;
  }

  protected abstract imageIds: string[];

  protected abstract loadEntities(): Promise<void>;

  private _isLoaded: boolean;

  private _size: ISize;

  private _assetsManager: AssetsManager;

  private setSize(size: ISize): void {
    if (!size) {
      throw new Error('Level size is not specified.');
    }

    this._size = size;
  }

  private setAssetsManager(assetsManager: AssetsManager): void {
    if (!assetsManager) {
      throw new Error('Assets manager is not specified.');
    }

    this._assetsManager = assetsManager;
  }
}

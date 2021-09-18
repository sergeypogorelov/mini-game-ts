import { IImg } from './core/img';

export abstract class AssetsManager {
  public abstract get isLoaded(): boolean;

  public constructor() {
    this.imageStoreMap = new Map<string, IImg>();
  }

  public abstract load(): Promise<void>;

  public getImage(id: string): IImg {
    return this.imageStoreMap.get(id);
  }

  protected abstract imageIds: string[];

  protected imageStoreMap: Map<string, IImg>;
}

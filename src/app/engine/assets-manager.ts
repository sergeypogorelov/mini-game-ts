import { IImg } from './core/img';

export abstract class AssetsManager {
  public abstract get isLoading(): boolean;

  public constructor() {
    this.imageStoreMap = new Map<string, IImg>();
  }

  public getImage(id: string): IImg {
    return this.imageStoreMap.get(id);
  }

  public abstract load(imageIds: string[]): Promise<void>;

  public clear(): void {
    this.imageStoreMap.clear();
  }

  protected readonly imageStoreMap: Map<string, IImg>;
}

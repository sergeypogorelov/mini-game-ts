import { IResourceLoadResultItem } from './resource-load-result-item.interface';

export interface IResourceLoadResult {
  images: IResourceLoadResultItem<HTMLImageElement>[];
  sounds: IResourceLoadResultItem<HTMLAudioElement>[];
}

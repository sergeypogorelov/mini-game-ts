import { ResourceLoadResultItem } from './resource-load-result-item.interface';

export interface ResourceLoadResult {
  images: ResourceLoadResultItem<HTMLImageElement>[];
}

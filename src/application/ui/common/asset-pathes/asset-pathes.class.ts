import { AssetTags } from '../../../game/asset-tags.enum';

import { ImagePathes } from './image-pathes/image-pathes.class';

export class AssetPathes {
  public static getPathByTag(tag: AssetTags): string {
    if (!tag) {
      throw new Error('Asset tag is not specified.');
    }

    return AssetPathes._map.get(tag);
  }

  private static _map = new Map<AssetTags, string>([[AssetTags.TestImage, ImagePathes.test]]);

  private constructor() {
    /// emulate a static class
  }
}

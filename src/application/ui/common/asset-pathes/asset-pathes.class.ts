import { ImageTags } from '../../../game/image-tags.enum';

import { ImagePathes } from './image-pathes/image-pathes.class';

export class AssetPathes {
  public static getImagePathByTag(tag: ImageTags): string {
    if (!tag) {
      throw new Error('Asset tag is not specified.');
    }

    return AssetPathes._imageMap.get(tag);
  }

  private static _imageMap = new Map<ImageTags, string>([[ImageTags.Test, ImagePathes.test]]);

  private constructor() {
    /// emulate a static class
  }
}

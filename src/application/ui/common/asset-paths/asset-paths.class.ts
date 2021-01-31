import { AudioTags } from '../../../game/audio-tags.enum';
import { ImageTags } from '../../../game/image-tags.enum';
import { AudioPaths } from './audio-paths/audio-paths.class';

import { ImagePaths } from './image-paths/image-paths.class';

export class AssetPaths {
  public static getImagePathByTag(tag: ImageTags): string {
    if (!tag) {
      throw new Error('Asset tag is not specified.');
    }

    return AssetPaths._imageMap.get(tag);
  }

  public static getAudioPathByTag(tag: AudioTags): string {
    if (!tag) {
      throw new Error('Asset tag is not specified.');
    }

    return AssetPaths._audioMap.get(tag);
  }

  private static _imageMap = new Map<ImageTags, string>([[ImageTags.Test, ImagePaths.test]]);

  private static _audioMap = new Map<AudioTags, string>([[AudioTags.Test, AudioPaths.test]]);

  private constructor() {
    /// emulate a static class
  }
}

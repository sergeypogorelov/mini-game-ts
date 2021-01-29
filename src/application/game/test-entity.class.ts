import { Entity } from '../engine/entity.class';
import { Size } from '../engine/size.class';
import { AssetTags } from './asset-tags.enum';

export class TestEntity extends Entity {
  public get imageTag(): string {
    return this._imageTag;
  }

  public constructor() {
    super(null, new Size(250, 125));
  }

  private _imageTag = AssetTags.TestImage;
}

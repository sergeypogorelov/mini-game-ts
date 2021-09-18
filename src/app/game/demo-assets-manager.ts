import { crystalYellowSpriteUrl, levelDemoImgUrl } from '../../assets';
import { AssetsManager } from '../engine/assets-manager';

export abstract class DemoAssetsManager extends AssetsManager {
  protected imageIds: string[] = [levelDemoImgUrl, crystalYellowSpriteUrl];
}

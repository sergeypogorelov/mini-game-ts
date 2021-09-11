import { crystalYellowSpriteFrames } from '../../assets';

import { Img } from '../engine/core/img';
import { IPoint } from '../engine/core/point';
import { Renderer } from '../engine/core/renderer';
import { ISize } from '../engine/core/size';
import { Sprite } from '../engine/core/sprite';

import { Entity } from '../engine/entities/entity';
import { SpriteAnimation } from '../engine/entities/sprite-animation';

export class Crystal extends Entity {
  public static readonly animationSpeed = 20;

  public constructor(spriteImg: Img, location: IPoint, size: ISize) {
    super(location, size);

    this.setSpriteAnimation(spriteImg);
  }

  public update(dt: number): void {
    this._spriteAnimation.update(dt);
  }

  public render(renderer: Renderer): void {
    this._spriteAnimation.render(renderer);
  }

  protected setLocation(location: IPoint): void {
    super.setLocation(location);

    this._spriteAnimation?.changeLocation(location);
  }

  protected setSize(size: ISize): void {
    super.setSize(size);

    this._spriteAnimation?.changeSize(size);
  }

  private _spriteAnimation: SpriteAnimation;

  private setSpriteAnimation(spriteImg: Img): void {
    if (!spriteImg) {
      throw new Error('Crystal sprite image is not specified.');
    }

    const sprite = Sprite.createFromArray(spriteImg, crystalYellowSpriteFrames);

    this._spriteAnimation = new SpriteAnimation({
      sprite,
      locationInUnits: this.location,
      sizeInUnits: this.size,
      speed: Crystal.animationSpeed,
      isInfinite: true,
    });
  }
}

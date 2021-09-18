import { crystalYellowSpriteFrames } from '../../assets';

import { IPoint } from '../engine/core/point';
import { ISize } from '../engine/core/size';
import { IImg } from '../engine/core/img';

import { Sprite } from '../engine/core/sprite';
import { SpriteAnimation } from '../engine/core/sprite-animation';

import { Renderer } from '../engine/core/renderer';

import { Entity } from '../engine/entities/entity';

export class Crystal extends Entity {
  public static readonly animationSpeed = 20;

  public constructor(spriteImg: IImg, location: IPoint, size: ISize) {
    super(location, size);

    this.setSpriteAnimation(spriteImg);
  }

  public update(dt: number): void {
    this._spriteAnimation.update(dt);
  }

  public render(renderer: Renderer): void {
    const { location, size } = this;
    this._spriteAnimation.render(renderer, location, size);
  }

  private _spriteAnimation: SpriteAnimation;

  private setSpriteAnimation(spriteImg: IImg): void {
    if (!spriteImg) {
      throw new Error('Crystal sprite image is not specified.');
    }

    const sprite = Sprite.createFromArray(spriteImg, crystalYellowSpriteFrames);

    this._spriteAnimation = new SpriteAnimation({
      sprite,
      speed: Crystal.animationSpeed,
      isInfinite: true,
    });
  }
}

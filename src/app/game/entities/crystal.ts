import { IImg } from '../../engine/core/img';
import { IPoint } from '../../engine/core/point';
import { Renderer } from '../../engine/core/renderer';
import { Sprite } from '../../engine/core/sprite';
import { SpriteAnimation } from '../../engine/core/sprite-animation';

import { GameEntity, GameEntityTypes } from './game-entity';

export enum CrystalColor {
  Grey = 'grey',
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

export interface ICrystalParams {
  location: IPoint;
  spriteImage: IImg;
  spriteFrames: number[][];
  color: CrystalColor;
}

export class Crystal extends GameEntity {
  public get color(): CrystalColor {
    return this._color;
  }

  public get spriteAnimation(): SpriteAnimation {
    return this._spriteAnimation;
  }

  public readonly animationSpeedByColorMap = new Map<CrystalColor, number>([
    [CrystalColor.Grey, 0],
    [CrystalColor.Red, 28],
    [CrystalColor.Green, 18],
    [CrystalColor.Blue, 24],
  ]);

  public constructor(params: ICrystalParams) {
    super(GameEntityTypes.Crystal, params?.location, Crystal.defSize);

    this.setColor(params?.color);
    this.setSpriteAnimation(params?.spriteImage, params?.spriteFrames);
  }

  public update(dt: number): void {
    if (this.color === CrystalColor.Grey) {
      return;
    }

    this.spriteAnimation.update(dt);
  }

  public render(renderer: Renderer): void {
    this.spriteAnimation.render(renderer, this.location, this.size);
  }

  public checkSwap(entity: GameEntity): boolean {
    if (this.color === CrystalColor.Grey) {
      return false;
    }

    if (entity.type === GameEntityTypes.EmptyCell) {
      return true;
    }

    if (entity.type === GameEntityTypes.Crystal) {
      const crystal = entity as Crystal;
      return crystal.color !== CrystalColor.Grey;
    }

    return false;
  }

  public freeze(): void {
    this.spriteAnimation.isPaused = true;
  }

  public unfreeze(): void {
    this.spriteAnimation.isPaused = false;
  }

  private _color: CrystalColor;

  private _spriteAnimation: SpriteAnimation;

  private setColor(color: CrystalColor): void {
    if (!color) {
      throw new Error('Crystal color is not specified.');
    }

    this._color = color;
  }

  private setSpriteAnimation(spriteImage: IImg, spriteFrames: number[][]): void {
    if (!spriteImage) {
      throw new Error('Sprite image is not specified.');
    }

    if (!spriteFrames) {
      throw new Error('Sprite frames are not specified.');
    }

    const sprite = Sprite.createFromArray(spriteImage, spriteFrames);
    const speed = this.animationSpeedByColorMap.get(this.color);

    this._spriteAnimation = new SpriteAnimation({
      sprite,
      speed,
      isInfinite: true,
    });
  }
}

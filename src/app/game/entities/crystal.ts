import {
  crystalBlueSpriteFrames,
  crystalBlueSpriteUrl,
  crystalGreenSpriteFrames,
  crystalGreenSpriteUrl,
  crystalGreySpriteFrames,
  crystalGreySpriteUrl,
  crystalRedSpriteFrames,
  crystalRedSpriteUrl,
} from '../../../assets';

import { IPoint } from '../../engine/core/point';
import { IImg } from '../../engine/core/img';

import { Sprite } from '../../engine/core/sprite';
import { SpriteAnimation } from '../../engine/core/sprite-animation';

import { Renderer } from '../../engine/core/renderer';
import { Utils } from '../../engine/core/utils';

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
  public static readonly spriteUrlPerColorMap = new Map<CrystalColor, string>([
    [CrystalColor.Grey, crystalGreySpriteUrl],
    [CrystalColor.Red, crystalRedSpriteUrl],
    [CrystalColor.Green, crystalGreenSpriteUrl],
    [CrystalColor.Blue, crystalBlueSpriteUrl],
  ]);

  public static readonly spriteFramesPerColorMap = new Map<CrystalColor, number[][]>([
    [CrystalColor.Grey, crystalGreySpriteFrames],
    [CrystalColor.Red, crystalRedSpriteFrames],
    [CrystalColor.Green, crystalGreenSpriteFrames],
    [CrystalColor.Blue, crystalBlueSpriteFrames],
  ]);

  public static readonly animationSpeedByColorMap = new Map<CrystalColor, number>([
    [CrystalColor.Grey, 0],
    [CrystalColor.Red, 24],
    [CrystalColor.Green, 18],
    [CrystalColor.Blue, 22],
  ]);

  public get isFrozen(): boolean {
    return this._isFrozen;
  }

  public get color(): CrystalColor {
    return this._color;
  }

  public get spriteAnimation(): SpriteAnimation {
    return this._spriteAnimation;
  }

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
    this._isFrozen = true;
    this.spriteAnimation.isPaused = true;
  }

  public unfreeze(): void {
    this._isFrozen = false;
    this.spriteAnimation.isPaused = false;
  }

  private _isFrozen: boolean;

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
    const speed = Crystal.animationSpeedByColorMap.get(this.color);

    this._spriteAnimation = new SpriteAnimation({
      sprite,
      speed,
      isInfinite: true,
    });

    if (this.color === CrystalColor.Grey) {
      const { spriteAnimation } = this;
      const randomNumber = Utils.getRandomInteger(0, spriteAnimation.countOfFrames - 1);
      spriteAnimation.forceFrameIndex(randomNumber);
    }
  }
}

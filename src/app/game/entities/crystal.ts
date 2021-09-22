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

import { IPoint, Point } from '../../engine/core/point';
import { IImg } from '../../engine/core/img';

import { Sprite } from '../../engine/core/sprite';
import { SpriteAnimation } from '../../engine/core/sprite-animation';

import { Renderer } from '../../engine/core/renderer';
import { Utils } from '../../engine/core/utils';

import { GameEntity, GameEntityTypes } from './game-entity';

export enum CrystalColors {
  Grey = 'grey',
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

export enum CrystalLeavingDirections {
  Top = 'top',
  Left = 'left',
}

export interface ICrystalParams {
  location: IPoint;
  spriteImage: IImg;
  spriteFrames: number[][];
  explosionSpriteImage: IImg;
  explosionSpriteFrames: number[][];
  color: CrystalColors;
}

export class Crystal extends GameEntity {
  public static readonly leavingSpeed = 6;
  public static readonly explosionAnimationSpeed = 15;

  public static readonly spriteUrlPerColorMap = new Map<CrystalColors, string>([
    [CrystalColors.Grey, crystalGreySpriteUrl],
    [CrystalColors.Red, crystalRedSpriteUrl],
    [CrystalColors.Green, crystalGreenSpriteUrl],
    [CrystalColors.Blue, crystalBlueSpriteUrl],
  ]);

  public static readonly spriteFramesPerColorMap = new Map<CrystalColors, number[][]>([
    [CrystalColors.Grey, crystalGreySpriteFrames],
    [CrystalColors.Red, crystalRedSpriteFrames],
    [CrystalColors.Green, crystalGreenSpriteFrames],
    [CrystalColors.Blue, crystalBlueSpriteFrames],
  ]);

  public static readonly animationSpeedByColorMap = new Map<CrystalColors, number>([
    [CrystalColors.Grey, 0],
    [CrystalColors.Red, 24],
    [CrystalColors.Green, 18],
    [CrystalColors.Blue, 22],
  ]);

  public get isFrozen(): boolean {
    return this._isFrozen;
  }

  public get isLeaving(): boolean {
    return this._isLeaving;
  }

  public get isExploding(): boolean {
    return this._isExploding;
  }

  public get color(): CrystalColors {
    return this._color;
  }

  public get spriteAnimation(): SpriteAnimation {
    return this._spriteAnimation;
  }

  public get explosionSpriteAnimation(): SpriteAnimation {
    return this._explosionSpriteAnimation;
  }

  public constructor(params: ICrystalParams) {
    super(GameEntityTypes.Crystal, params?.location, Crystal.defSize);

    this.setColor(params?.color);
    this.setSpriteAnimation(params?.spriteImage, params?.spriteFrames);
    this.setExplosionSpriteAnimation(params?.explosionSpriteImage, params?.explosionSpriteFrames);
  }

  public update(dt: number): void {
    if (this.isExploding) {
      this.explosionSpriteAnimation.update(dt);
    } else {
      this.spriteAnimation.update(dt);

      if (this.isLeaving) {
        this.updateLeavingLocation(dt);
      }
    }
  }

  public render(renderer: Renderer): void {
    if (this.isExploding) {
      this.explosionSpriteAnimation.render(renderer, this.location, this.size);
    } else {
      this.spriteAnimation.render(renderer, this.location, this.size);
    }
  }

  public destroy(): void {
    if (this.isLeaving) {
      return;
    }

    this._isLeaving = true;

    const crystalLeavingDirections = Object.values(CrystalLeavingDirections);
    const randomIndex = Utils.getRandomInteger(0, crystalLeavingDirections.length - 1);

    this._leavingDirection = crystalLeavingDirections[randomIndex];
  }

  public checkSwap(entity: GameEntity): boolean {
    if (!this.checkNeighbor(entity)) {
      return false;
    }

    if (this.color === CrystalColors.Grey) {
      return false;
    }

    if (entity.type === GameEntityTypes.EmptyCell) {
      return true;
    }

    if (entity.type === GameEntityTypes.Crystal) {
      const crystal = entity as Crystal;
      return crystal.color !== CrystalColors.Grey;
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

  private _isLeaving: boolean;

  private _isExploding: boolean;

  private _leavingDirection: CrystalLeavingDirections;

  private _color: CrystalColors;

  private _spriteAnimation: SpriteAnimation;

  private _explosionSpriteAnimation: SpriteAnimation;

  private updateLeavingLocation(dt: number): void {
    if (!this.isLeaving || this.isExploding) {
      return;
    }

    const { x: cx, y: cy } = this.location;

    if (cx <= 0 || cy <= 0) {
      this._isExploding = true;
      return;
    }

    let nx = cx;
    let ny = cy;

    if (this._leavingDirection === CrystalLeavingDirections.Top) {
      ny = cy - (Crystal.leavingSpeed * dt) / 1000;
    } else if (this._leavingDirection === CrystalLeavingDirections.Left) {
      nx = cx - (Crystal.leavingSpeed * dt) / 1000;
    }

    this.changeLocation(new Point(nx, ny));
  }

  private setColor(color: CrystalColors): void {
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

    if (this.color === CrystalColors.Grey) {
      const { spriteAnimation } = this;
      const randomNumber = Utils.getRandomInteger(0, spriteAnimation.countOfFrames - 1);
      spriteAnimation.forceFrameIndex(randomNumber);
    }
  }

  private setExplosionSpriteAnimation(spriteImage: IImg, spriteFrames: number[][]): void {
    if (!spriteImage) {
      throw new Error('Explosion sprite image is not specified.');
    }

    if (!spriteFrames) {
      throw new Error('Explosion sprite frames are not specified.');
    }

    const sprite = Sprite.createFromArray(spriteImage, spriteFrames);
    const speed = Crystal.explosionAnimationSpeed;

    this._explosionSpriteAnimation = new SpriteAnimation({
      sprite,
      speed,
    });

    this._explosionSpriteAnimation.onAnimationFinish.attach(() => {
      this.onDisposalReady.emit();
    });
  }
}

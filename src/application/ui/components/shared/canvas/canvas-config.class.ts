import { CanvasConfigScheme } from './canvas-config-scheme.interface';

export class CanvasConfig implements CanvasConfigScheme {
  public static readonly minWidth = 320;

  public static readonly minHeight = 240;

  public static generateDefault(): CanvasConfig {
    const scheme: CanvasConfigScheme = {
      width: CanvasConfig.minWidth,
      height: CanvasConfig.minHeight,
    };

    return new CanvasConfig(scheme);
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public constructor(scheme?: CanvasConfigScheme) {
    if (!scheme) {
      return CanvasConfig.generateDefault();
    }

    if (!scheme.width) {
      throw new Error('Width is not defined.');
    }

    if (scheme.width < CanvasConfig.minWidth) {
      throw new Error(`Width cannot be less than ${CanvasConfig.minWidth}.`);
    }

    this._width = scheme.width;

    if (!scheme.height) {
      throw new Error('Height is not defined.');
    }

    if (scheme.height < CanvasConfig.minHeight) {
      throw new Error(`Height cannot be less than ${CanvasConfig.minHeight}.`);
    }

    this._height = scheme.height;
  }

  public clone(): CanvasConfig {
    const scheme: CanvasConfigScheme = {
      width: this.width,
      height: this.height,
    };

    return new CanvasConfig(scheme);
  }

  private _width: number;

  private _height: number;
}

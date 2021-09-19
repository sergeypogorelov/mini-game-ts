import { IDrawable } from './core/interfaces/drawable.interface';

import { ISize } from './core/size';
import { EventEmitter } from './core/event-emmiter';
import { Renderer } from './core/renderer';

import { Level } from './level';

export interface IEngineConfig {
  readonly graphicContext: IDrawable;
  readonly resolutionObserver: {
    readonly currentResolution: ISize;
    readonly onChange: EventEmitter<ISize>;
  };
  readonly animator: {
    readonly onBeforeRepaint: EventEmitter<number>;
  };
}

export abstract class Engine {
  public readonly onEnd = new EventEmitter<void>();

  public readonly onError = new EventEmitter<Error>();

  public get isUpdatingEnabled(): boolean {
    return this._isUpdatingEnabled;
  }

  public get isRenderingEnabled(): boolean {
    return this._isRenderingEnabled;
  }

  public get isUpdateable(): boolean {
    return Boolean(this.currentLevel?.isLoaded);
  }

  public get isRenderable(): boolean {
    return Boolean(this.currentLevel?.isLoaded);
  }

  public get currentLevel(): Level {
    return this._currentLevel;
  }

  public get renderer(): Renderer {
    return this._renderer;
  }

  public get engineConfig(): IEngineConfig {
    return this._engineConfig;
  }

  public constructor(cfg: IEngineConfig) {
    this.setEngineConfig(cfg);
    this.initEngineConfig();
  }

  public changeCurrentLevel(level: Level): void {
    if (!level) {
      throw new Error('Level is not specified.');
    }

    if (this.isUpdatingEnabled) {
      throw new Error('Cannot change level as updating is enabled.');
    }

    if (this.isRenderingEnabled) {
      throw new Error('Cannot change level as rendering is enabled.');
    }

    if (this._currentLevel) {
      this._currentLevel.assetsManager.clear();
    }

    this._currentLevel = level;

    if (this.renderer) {
      this.renderer.changeSizeInUnits(level.size);
    } else {
      const renderer = new Renderer(
        this.engineConfig.graphicContext,
        this.engineConfig.resolutionObserver.currentResolution,
        level.size,
      );

      this.setRenderer(renderer);

      this.engineConfig.resolutionObserver.onChange.attach((newSizeInPixels) => {
        this.renderer.changeSizeInPixels(newSizeInPixels);
      });
    }
  }

  public setUpdatingStatus(enabled: boolean): void {
    this._isUpdatingEnabled = enabled;
  }

  public setRenderingStatus(enabled: boolean): void {
    this._isRenderingEnabled = enabled;
  }

  private _isUpdatingEnabled: boolean;

  private _isRenderingEnabled: boolean;

  private _currentLevel: Level;

  private _renderer: Renderer;

  private _engineConfig: IEngineConfig;

  private setRenderer(renderer: Renderer): void {
    if (!renderer) {
      throw new Error('Renderer is not specified.');
    }

    this._renderer = renderer;
  }

  private setEngineConfig(cfg: IEngineConfig): void {
    if (!cfg) {
      throw new Error('Engine config is not specified.');
    }

    this._engineConfig = cfg;
  }

  private initEngineConfig(): void {
    this.engineConfig.animator.onBeforeRepaint.attach((dt) => {
      try {
        if (this.isUpdatingEnabled && this.isUpdateable) {
          this.currentLevel.update(dt);
        }

        if (this.isRenderingEnabled && this.isRenderable) {
          this.currentLevel.render(this.renderer);
        }
      } catch (e) {
        if (e instanceof Error) {
          this.onError.emit(e);
        }

        throw e;
      }
    });
  }
}

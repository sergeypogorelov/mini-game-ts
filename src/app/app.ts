import { IEngineConfig } from './engine/engine';
import { DemoLevel } from './game/demo-level';
import { Game } from './game/game';

import { WebAnimator } from './ui/web-animator';
import { WebAssetsManager } from './ui/web-assets-manager';
import { WebGraphicContext } from './ui/web-graphic-context';
import { WebResolutionObserver } from './ui/web-resolution-observer';

export class App {
  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get rootEl(): HTMLDivElement {
    return this._rootEl;
  }

  public constructor(rootElement: HTMLDivElement) {
    this.setRootElement(rootElement);
  }

  public run(): void {
    if (this._isRunning) {
      throw new Error('The app is already running.');
    }

    this._isRunning = true;

    const assetsManager = new WebAssetsManager();
    const animator = new WebAnimator();
    const resolutionObserver = new WebResolutionObserver();

    const currentResolution = resolutionObserver.currentResolution;
    const canvasEl = this.createCanvasEl(currentResolution.width, currentResolution.height);

    const graphicContext = new WebGraphicContext(canvasEl, assetsManager);

    const engineCfg: IEngineConfig = {
      graphicContext,
      animator,
      resolutionObserver,
    };

    const game = new Game(engineCfg);
    game.changeCurrentLevel(new DemoLevel(assetsManager));
    game.currentLevel.load().then(() => {
      this.rootEl.appendChild(canvasEl);

      game.setUpdatingStatus(true);
      game.setRenderingStatus(true);
    });

    resolutionObserver.onChange.attach(() => {
      const { width, height } = resolutionObserver.currentResolution;

      canvasEl.width = width;
      canvasEl.height = height;
    });

    resolutionObserver.startWatching();
    animator.startAnimating();
  }

  private _isRunning: boolean;

  private _rootEl: HTMLDivElement;

  private createCanvasEl(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  private setRootElement(el: HTMLDivElement): void {
    if (!el) {
      throw new Error('Root element is not specified.');
    }

    this._rootEl = el;
  }
}

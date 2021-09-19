import { IEngineConfig } from './engine/engine';

import { DemoLevel } from './game/demo-level';
import { Game } from './game/game';

import { WebAnimator } from './ui/web-animator';
import { WebAssetsManager } from './ui/web-assets-manager';
import { WebGraphicContext } from './ui/web-graphic-context';
import { WebResolutionAdapter } from './ui/web-resolution-adapter';

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

  public async run(): Promise<void> {
    if (this._isRunning) {
      throw new Error('The app is already running.');
    }

    this._isRunning = true;

    const resolutionAdapter = new WebResolutionAdapter();

    const currentResolution = resolutionAdapter.currentResolution;
    const canvasEl = this.createCanvasEl(currentResolution.width, currentResolution.height);

    resolutionAdapter.onChange.attach(() => {
      const { width, height } = resolutionAdapter.currentResolution;

      canvasEl.width = width;
      canvasEl.height = height;
    });

    resolutionAdapter.startWatching();

    const animator = new WebAnimator();
    const assetsManager = new WebAssetsManager();
    const graphicContext = new WebGraphicContext(canvasEl, assetsManager);

    const engineCfg: IEngineConfig = {
      graphicContext,
      animator,
      resolutionAdapter,
    };

    const game = new Game(engineCfg);
    game.changeCurrentLevel(new DemoLevel(assetsManager));

    await game.currentLevel.load();

    this.rootEl.appendChild(canvasEl);

    animator.startAnimating();

    game.setUpdatingStatus(true);
    game.setRenderingStatus(true);
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

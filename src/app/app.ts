import { IEngineConfig } from './engine/engine';

import { DemoLevel } from './game/demo-level';
import { Game } from './game/game';

import { WebAnimator } from './ui/web-animator';
import { WebAssetsManager } from './ui/web-assets-manager';
import { WebGraphicContext } from './ui/web-graphic-context';
import { WebPlayerInput } from './ui/web-player-input';
import { WebResolutionWatcher } from './ui/web-resolution-adapter';

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

    const resolutionWacther = new WebResolutionWatcher();

    const currentResolution = resolutionWacther.currentResolution;
    const canvasEl = this.createCanvasEl(currentResolution.width, currentResolution.height);

    resolutionWacther.onChange.attach(() => {
      const { width, height } = resolutionWacther.currentResolution;

      canvasEl.width = width;
      canvasEl.height = height;
    });

    resolutionWacther.startWatching();

    const animator = new WebAnimator();
    const assetsManager = new WebAssetsManager();
    const playerInput = new WebPlayerInput(canvasEl);
    const graphicContext = new WebGraphicContext(canvasEl, assetsManager);

    const engineCfg: IEngineConfig = {
      graphicContext,
      animator,
      resolutionWacther,
      playerInput,
    };

    const game = new Game(engineCfg);
    game.changeCurrentLevel(new DemoLevel(assetsManager));
    game.currentLevel.onVictory.attach(() => {
      playerInput.stopHandling();

      this.addVictoryElements();
    });

    await game.currentLevel.load();

    this.removeLoaderElement();
    this.addCanvas(canvasEl);

    animator.startAnimating();
    playerInput.startHandling();

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

  private createDarkLayerElement(): HTMLDivElement {
    const element = document.createElement('div');
    element.classList.add('dark-layer');

    return element;
  }

  private createVictoryElement(): HTMLDivElement {
    const element = document.createElement('div');
    element.classList.add('victory');

    let messageEl = document.createElement('div');
    messageEl.textContent = 'Riddle Solved!';
    element.appendChild(messageEl);

    messageEl = document.createElement('div');
    messageEl.textContent = 'Congratulations!';
    element.appendChild(messageEl);

    return element;
  }

  private addCanvas(canvasEl: HTMLCanvasElement): void {
    if (!canvasEl) {
      throw new Error('Canvas element is not specified.');
    }

    this._rootEl.appendChild(canvasEl);
  }

  private addVictoryElements(): void {
    const darkLayerElement = this.createDarkLayerElement();
    this.rootEl.appendChild(darkLayerElement);

    const victoryElement = this.createVictoryElement();
    this.rootEl.appendChild(victoryElement);
  }

  private removeLoaderElement(): void {
    const el = document.querySelector('.loader-wrapper');
    this._rootEl.removeChild(el);
  }

  private setRootElement(el: HTMLDivElement): void {
    if (!el) {
      throw new Error('Root element is not specified.');
    }

    this._rootEl = el;
  }
}

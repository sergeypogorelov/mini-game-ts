import './index.css';

import { IDrawParams, IDrawable } from './app/engine/core/interfaces/drawable.interface';
import { ISize, Size } from './app/engine/core/size';
import { EventEmitter } from './app/engine/core/event-emmiter';

import { IEngineConfig } from './app/engine/engine';
import { Game } from './app/game/game';
import { DemoLevel } from './app/game/demo-level';

import { WebAssetsManager } from './app/ui/web-assets-manager';

const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;

canvasEl.width = 700;
canvasEl.height = 400;

const canvasContext = canvasEl.getContext('2d');

const assetsManager = new WebAssetsManager();

const graphicContext: IDrawable = {
  clear() {
    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
  },
  drawImage(params: IDrawParams) {
    const { image, srcPoint, srcSize, destPoint, destSize } = params;

    const { x: sx, y: sy } = srcPoint;
    const { width: sw, height: sh } = srcSize;
    const { x: dx, y: dy } = destPoint;
    const { width: dw, height: dh } = destSize;

    const imageElement = assetsManager.getImageElement(image.id);
    canvasContext.drawImage(imageElement, sx, sy, sw, sh, dx, dy, dw, dh);
  },
};

const cfg: IEngineConfig = {
  graphicContext,
  animator: {
    onBeforeRepaint: new EventEmitter<number>(),
  },
  resolutionObserver: {
    initialValue: new Size(canvasEl.width, canvasEl.height),
    onChange: new EventEmitter<ISize>(),
  },
};

const game = new Game(cfg);
game.changeCurrentLevel(new DemoLevel(assetsManager));
game.currentLevel.load().then(() => {
  game.setUpdatingStatus(true);
  game.setRenderingStatus(true);
});

let prevDate = new Date();

const callback = () => {
  const newDate = new Date();
  const dt = newDate.getTime() - prevDate.getTime();

  cfg.animator.onBeforeRepaint.emit(dt);

  prevDate = newDate;

  requestAnimationFrame(() => callback());
};

requestAnimationFrame(() => callback());

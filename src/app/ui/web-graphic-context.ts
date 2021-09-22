import { IDrawable, IDrawParams } from '../engine/core/interfaces/drawable.interface';
import { WebAssetsManager } from './web-assets-manager';

export class WebGraphicContext implements IDrawable {
  public get canvasEl(): HTMLCanvasElement {
    return this._canvasEl;
  }

  public get canvasContext(): CanvasRenderingContext2D {
    return this._canvasContext;
  }

  public get assetsManager(): WebAssetsManager {
    return this._assetsManager;
  }

  public constructor(canvasEl: HTMLCanvasElement, assetsManager: WebAssetsManager) {
    this.setCanvasEl(canvasEl);
    this.setCanvasContext(canvasEl.getContext('2d'));
    this.setAssetsManager(assetsManager);
  }

  public clear(): void {
    const { canvasEl, canvasContext } = this;

    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  public drawImage(params: IDrawParams): void {
    if (!params) {
      throw new Error('Draw params are not specified.');
    }

    const { image, srcPoint, srcSize, destPoint, destSize } = params;

    const { x: sx, y: sy } = srcPoint;
    const { width: sw, height: sh } = srcSize;
    const { x: dx, y: dy } = destPoint;
    const { width: dw, height: dh } = destSize;

    const imageElement = this.assetsManager.getImageElement(image.id);
    this.canvasContext.drawImage(imageElement, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  private _canvasEl: HTMLCanvasElement;

  private _canvasContext: CanvasRenderingContext2D;

  private _assetsManager: WebAssetsManager;

  private setCanvasEl(el: HTMLCanvasElement): void {
    if (!el) {
      throw new Error('Canvas element is not specified.');
    }

    this._canvasEl = el;
  }

  private setCanvasContext(context: CanvasRenderingContext2D): void {
    if (!context) {
      throw new Error('Canvas context is not specified.');
    }

    this._canvasContext = context;
  }

  private setAssetsManager(manager: WebAssetsManager): void {
    if (!manager) {
      throw new Error('Assets manager is not specified.');
    }

    this._assetsManager = manager;
  }
}

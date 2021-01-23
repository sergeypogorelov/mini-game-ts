import { View } from '../../../common/view/view.class';
import { CanvasConfig } from './canvas-config.class';

export class CanvasView extends View<HTMLCanvasElement> {
  public constructor(cfg?: CanvasConfig) {
    super(document.createElement('canvas'));

    this.initConfig(cfg);

    this.initHost();
    this.initContext();
  }

  public fillFullRect(fillStyle: string): void {
    if (!fillStyle) {
      throw new Error('Fill style is not defined.');
    }

    this._context.fillStyle = fillStyle;
    this._context.fillRect(0, 0, this._cfg.width, this._cfg.height);
  }

  private _cfg: CanvasConfig;

  private _context: CanvasRenderingContext2D;

  private initConfig(cfg?: CanvasConfig): void {
    if (!cfg) {
      cfg = CanvasConfig.generateDefault();
    }

    this._cfg = cfg.clone();
  }

  private initHost(): void {
    this.host.width = this._cfg.width;
    this.host.height = this._cfg.height;
  }

  private initContext(): void {
    this._context = this.host.getContext('2d');
  }
}

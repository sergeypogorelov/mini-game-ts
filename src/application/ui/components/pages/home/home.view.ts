import { View } from '../../../common/view/view.class';
import { CanvasConfig } from '../../shared/canvas/canvas-config.class';

import { CanvasComponent } from '../../shared/canvas/canvas.component';

export class HomeView extends View<HTMLDivElement> {
  public constructor() {
    super(document.createElement('div'));
  }

  public onInit(): void {
    const canvasConfig = new CanvasConfig({
      width: 1000,
      height: 500,
    });
    this._canvasComponent = new CanvasComponent(canvasConfig);

    this._canvasComponent.view.fillFullRect('rgb(0,0,128)');
    this._canvasComponent.view.drawEntity();

    this.host.appendChild(this._canvasComponent.view.host);
  }

  private _canvasComponent: CanvasComponent;
}

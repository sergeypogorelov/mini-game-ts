import { View } from '../../../common/view/view.class';
import { CanvasComponent } from '../../shared/canvas/canvas.component';

export class HomeView extends View<HTMLDivElement> {
  public constructor() {
    super(document.createElement('div'));
  }

  public onInit(): void {
    this._canvasComponent = new CanvasComponent();

    this._canvasComponent.view.fillFullRect('rgb(128,0,0)');

    this.host.appendChild(this._canvasComponent.view.host);
  }

  private _canvasComponent: CanvasComponent;
}

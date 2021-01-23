import { Component } from '../../../common/component/component.class';
import { CanvasConfig } from './canvas-config.class';
import { CanvasView } from './canvas.view';

export class CanvasComponent extends Component<CanvasView> {
  public constructor(cfg?: CanvasConfig) {
    super(new CanvasView(cfg));
  }
}

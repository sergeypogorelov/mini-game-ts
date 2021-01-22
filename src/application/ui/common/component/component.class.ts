import { View } from '../view/view.class';

export class Component<VT extends View<HT>, HT extends HTMLElement = HTMLElement> {
  public get view(): VT {
    return this._view;
  }

  public constructor(view: VT) {
    if (!view) {
      throw new Error('View is not defined.');
    }

    this._view = view;
  }

  public onInit(): void {
    this.view.onInit();
  }

  public onDestroy(): void {
    this.view.onDestroy();
  }

  private _view: VT;
}

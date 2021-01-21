export abstract class View<HT extends HTMLElement> {
  public static readonly idPrefix = 'component-';

  public get id(): string {
    return this._id;
  }

  public get host(): HT {
    return this._host;
  }

  public constructor(host: HT) {
    if (!host) {
      throw new Error('Host is not defined.');
    }

    host.id = View.generateId();

    this._host = host;
    this._id = host.id;

    this.setNameSpaceToElement(host);
  }

  public onInit(): void {
    /// nothing by default
  }

  public onDestroy(): void {
    /// nothing by default
  }

  protected createElement<ET extends keyof HTMLElementTagNameMap>(
    tagName: ET,
    options?: ElementCreationOptions,
  ): HTMLElementTagNameMap[ET] {
    if (!tagName) {
      throw new Error('Tag name is not defined.');
    }

    const element = document.createElement(tagName, options);

    this.setNameSpaceToElement(element);

    return element;
  }

  protected querySelector<ET extends HTMLElement>(selector: string): ET {
    const element = this.host.querySelector<ET>(selector);
    if (this.checkElementNameSpace(element)) {
      return element;
    }
  }

  protected querySelectorAll<ET extends HTMLElement>(selector: string): ET[] {
    const result: ET[] = [];

    const nodeList = this.host.querySelectorAll<ET>(selector);
    nodeList.forEach((element) => {
      if (this.checkElementNameSpace(element)) {
        result.push(element);
      }
    });

    return result;
  }

  private static _idCounter = 0;

  private static generateId(): string {
    View._idCounter++;

    return View.idPrefix + View._idCounter;
  }

  private _id: string;

  private _host: HT;

  private checkElementNameSpace<ET extends HTMLElement>(element: ET): boolean {
    if (!element) {
      throw new Error('Element is not defined.');
    }

    return element.dataset.namespace === this.host.id;
  }

  private setNameSpaceToElement<ET extends HTMLElement>(element: ET): void {
    if (!element) {
      throw new Error('Element is not defined.');
    }

    element.dataset.namespace = this.host.id;
  }
}

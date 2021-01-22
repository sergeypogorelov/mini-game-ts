export abstract class View<HT extends HTMLElement> {
  public static readonly idPrefix = '__component-';

  public static readonly nameSpaceKey = '__namespace';

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

  protected getElementByTagName<ET extends keyof HTMLElementTagNameMap>(tagName: ET): HTMLElementTagNameMap[ET] {
    if (!tagName) {
      throw new Error('Tag name is not defined.');
    }

    return this.getElementsByTagName(tagName)[0];
  }

  protected getElementsByTagName<ET extends keyof HTMLElementTagNameMap>(tagName: ET): HTMLElementTagNameMap[ET][] {
    if (!tagName) {
      throw new Error('Tag name is not defined.');
    }

    const result: HTMLElementTagNameMap[ET][] = [];

    const elements = this.host.getElementsByTagName(tagName);
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (element instanceof HTMLElement && this.checkElementNameSpace(element)) {
        result.push(element);
      }
    }

    return result;
  }

  protected getElementByClassName(className: string): HTMLElement {
    if (!className) {
      throw new Error('Class name is not defined.');
    }

    return this.getElementsByClassName(className)[0];
  }

  protected getElementsByClassName(className: string): HTMLElement[] {
    if (!className) {
      throw new Error('Class name is not defined.');
    }

    const result: HTMLElement[] = [];

    const elements = this.host.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (element instanceof HTMLElement && this.checkElementNameSpace(element)) {
        result.push(element);
      }
    }

    return result;
  }

  protected querySelector<ET extends HTMLElement>(selector: string): ET {
    if (!selector) {
      throw new Error('Selector is not defined.');
    }

    const element = this.host.querySelector<ET>(selector);
    if (this.checkElementNameSpace(element)) {
      return element;
    }
  }

  protected querySelectorAll<ET extends HTMLElement>(selector: string): ET[] {
    if (!selector) {
      throw new Error('Selector is not defined.');
    }

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

    return element.dataset[View.nameSpaceKey] === this.host.id;
  }

  private setNameSpaceToElement<ET extends HTMLElement>(element: ET): void {
    if (!element) {
      throw new Error('Element is not defined.');
    }

    element.dataset[View.nameSpaceKey] = this.host.id;
  }
}

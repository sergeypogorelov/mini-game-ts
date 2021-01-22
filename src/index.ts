import './index.scss';

import { Component } from './application/ui/common/component/component.class';
import { View } from './application/ui/common/view/view.class';

/* eslint-disable-next-line */
const path = require('./assets/images/img.png').default;
console.log(path);

class TestComponent extends Component<TestView> {
  public setTitle(value?: string): void {
    if (!value) {
      value = 'World';
    }

    value = `Hello ${value}`;

    this.view.setTitle(value);
  }
}

class TestView extends View<HTMLDivElement> {
  public constructor() {
    super(document.createElement('div'));
  }

  public onInit(): void {
    super.onInit();

    const titleElement = this.createElement('h1');
    this.host.appendChild(titleElement);
  }

  public setTitle(value: string) {
    const titleElement = this.getElementByTagName('h1');
    titleElement.textContent = value;
  }
}

const testComponent = new TestComponent(new TestView());

testComponent.onInit();
testComponent.setTitle();

document.getElementById('root').appendChild(testComponent.view.host);

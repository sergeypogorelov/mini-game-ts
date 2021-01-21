import './index.scss';

import { View } from './application/ui/common/view/view.class';

/* eslint-disable-next-line */
const path = require('./assets/images/img.png').default;
console.log(path);

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
    const titleElement = this.querySelector('h1') as HTMLHeadingElement;
    titleElement.textContent = value;
  }
}

const testView = new TestView();

testView.onInit();
testView.setTitle('Hello World!');

document.getElementById('root').appendChild(testView.host);

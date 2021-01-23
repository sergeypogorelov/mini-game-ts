import { Component } from '../../../common/component/component.class';
import { HomeView } from './home.view';

export class HomeComponent extends Component<HomeView> {
  public constructor() {
    super(new HomeView());
  }
}

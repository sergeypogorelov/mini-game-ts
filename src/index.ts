import './index.scss';

import { HomeComponent } from './application/ui/components/pages/home/home.component';

const homeComponent = new HomeComponent();
homeComponent.onInit();

document.getElementById('root').appendChild(homeComponent.view.host);

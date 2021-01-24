import './index.scss';

import { ImageLoader } from './application/ui/common/image-loader/image-loader.class';
import { HomeComponent } from './application/ui/components/pages/home/home.component';

const homeComponent = new HomeComponent();
homeComponent.onInit();

document.getElementById('root').appendChild(homeComponent.view.host);

/* eslint-disable-next-line */
const imgUrl = require('./assets/images/img.png').default;
const imageLoader = new ImageLoader();

imageLoader.onGlobalLoadStart.subscribe(() => console.log('start'));
imageLoader.onGlobalLoadEnd.subscribe(() => console.log('end'));

imageLoader
  .load(imgUrl)
  .then((element) => document.getElementById('root').appendChild(element))
  .catch((err) => console.error(err));

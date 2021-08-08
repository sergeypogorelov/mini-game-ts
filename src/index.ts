import './index.css';

import { Test } from './test';

const imgSrc = require('./assets/images/img.png').default;

const imgEl = new Image();
imgEl.src = imgSrc;
document.body.appendChild(imgEl);

document.getElementById('header').innerText = Test.test;

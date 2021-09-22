import './index.css';

import { App } from './app/app';

const rootEl = document.getElementById('root') as HTMLDivElement;
const app = new App(rootEl);

app.run();

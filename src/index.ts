import './index.scss';

import { SyncEventEmitter } from './application/core/sync-event-emitter/sync-event-emitter.class';

/* eslint-disable-next-line */
const path = require('./assets/images/img.png').default;
console.log(path);

const emitter = new SyncEventEmitter<number>();
const event = emitter.asEvent();

emitter.emit(0);

const sub1 = event.subscribe((value) => console.log('handle1', value));
const sub2 = event.subscribe((value) => console.log('handle2', value));

emitter.emit(1);

sub1.unsubscribe();

emitter.emit(2);

sub2.unsubscribe();

emitter.emit(3);

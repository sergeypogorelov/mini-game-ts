import './index.scss';

/* eslint-disable-next-line */
const path = require('./assets/images/img.png').default;
console.log(path);

interface TestObject {
  testValue: string;
}

const obj: TestObject = {
  testValue: 'test',
};

console.log(obj.testValue);

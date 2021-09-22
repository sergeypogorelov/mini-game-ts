import { IPoint } from '../point';
import { ISize } from '../size';

import { IImg } from '../img';

export interface IDrawParams {
  image: IImg;
  srcPoint: IPoint;
  srcSize: ISize;
  destPoint: IPoint;
  destSize: ISize;
}

export interface IDrawable {
  clear(): void;
  drawImage(params: IDrawParams): void;
}

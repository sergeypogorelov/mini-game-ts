import { IPoint } from './point';
import { ISize } from './size';

import { IImageDescriptor } from './image-descriptor';

export interface IDrawParams {
  image: IImageDescriptor;
  srcPoint: IPoint;
  srcSize: ISize;
  destPoint: IPoint;
  destSize: ISize;
}

export interface IGraphicContext {
  readonly size: ISize;

  drawImage(params: IDrawParams): void;
}

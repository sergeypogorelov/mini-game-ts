import { IPoint } from './point.interface';
import { ISize } from './size.interface';

export interface IDrawParams {
  srcPoint: IPoint;
  srcSize: ISize;
  distPoint: IPoint;
  distSize: ISize;
}

export interface IDrawable {
  draw(params: IDrawParams): void;
}

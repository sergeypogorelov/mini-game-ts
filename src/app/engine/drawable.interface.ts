import { Point } from './point';
import { Size } from './size';

export interface IDrawParams {
  srcPoint: Point;
  srcSize: Size;
  distPoint: Point;
  distSize: Size;
}

export interface IDrawable {
  draw(params: IDrawParams): void;
}

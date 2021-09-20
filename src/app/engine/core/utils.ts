import { IPoint } from './point';
import { ISize } from './size';

export class Utils {
  public static checkTouch(point: IPoint, targetPoint: IPoint, targetSize: ISize): boolean {
    if (!point) {
      throw new Error('Point is not specified.');
    }

    if (!targetPoint) {
      throw new Error('Target point is not specified.');
    }

    if (!targetSize) {
      throw new Error('Target size is not specified.');
    }

    const { x, y } = point;
    const { x: tx, y: ty } = targetPoint;
    const { width: tw, height: th } = targetSize;

    return x >= tx && x <= tx + tw && y >= ty && y <= ty + th;
  }

  private constructor() {
    /// static class
  }
}

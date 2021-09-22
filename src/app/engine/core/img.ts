import { ISize } from './size';

export interface IImg {
  readonly id: string;
  readonly size: ISize;
}

export class Img implements IImg {
  public readonly id: string;

  public readonly size: ISize;

  public constructor(id: string, size: ISize) {
    if (!id) {
      throw new Error('Image id is not specified.');
    }

    this.id = id;

    if (!size) {
      throw new Error('Image size is not specified.');
    }

    this.size = size;
  }
}

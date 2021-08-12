export interface IDrawParams {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export interface IDrawable {
  draw(params: IDrawParams): void;
}

import './index.css';

import { spriteFrames, spriteUrl } from './assets';

import { IDrawable, IDrawParams } from './app/engine/drawable.interface';

import { Point } from './app/engine/point';
import { Sprite } from './app/engine/sprite';
import { SpriteAnimation } from './app/engine/sprite-animation';

const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;

canvasEl.width = 640;
canvasEl.height = 480;

const context = canvasEl.getContext('2d');

const spriteImg = new Image();
spriteImg.src = spriteUrl;
spriteImg.onload = () => {
  document.body.removeChild(spriteImg);

  const drawableObj: IDrawable = {
    draw(params: IDrawParams) {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);

      const { srcPoint, srcSize, distPoint, distSize } = params;

      const { x: sx, y: sy } = srcPoint;
      const { width: sw, height: sh } = srcSize;
      const { x: dx, y: dy } = distPoint;
      const { width: dw, height: dh } = distSize;

      context.drawImage(spriteImg, sx, sy, sw, sh, dx, dy, dw, dh);
    },
  };

  const sprite = Sprite.createFromArray(spriteFrames);
  const spriteAnimation = new SpriteAnimation({ sprite, isInfinite: true });

  let prevDate = new Date();

  const callback = () => {
    const newDate = new Date();
    const dt = newDate.getTime() - prevDate.getTime();

    spriteAnimation.update(dt);
    spriteAnimation.render({ context: drawableObj, distPoint: new Point(0, 0) });

    prevDate = newDate;

    requestAnimationFrame(() => callback());
  };

  requestAnimationFrame(() => callback());
};

document.body.appendChild(spriteImg);

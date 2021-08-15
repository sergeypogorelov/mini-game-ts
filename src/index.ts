import './index.css';

import { spriteFrames, spriteUrl } from './assets';

import { IDrawable, IDrawParams } from './app/engine/drawable.interface';

import { Point } from './app/engine/point';
import { Size } from './app/engine/size';

import { Renderer } from './app/engine/renderer';
import { Sprite } from './app/engine/sprite';
import { SpriteAnimation } from './app/engine/sprite-animation';

const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;

canvasEl.width = 640;
canvasEl.height = 480;

const canvasContext = canvasEl.getContext('2d');

const spriteImg = new Image();
spriteImg.src = spriteUrl;
spriteImg.onload = () => {
  document.body.removeChild(spriteImg);

  const context: IDrawable = {
    draw(params: IDrawParams) {
      canvasContext.fillStyle = '#fff';
      canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);

      const { srcPoint, srcSize, distPoint, distSize } = params;

      const { x: sx, y: sy } = srcPoint;
      const { width: sw, height: sh } = srcSize;
      const { x: dx, y: dy } = distPoint;
      const { width: dw, height: dh } = distSize;

      canvasContext.drawImage(spriteImg, sx, sy, sw, sh, dx, dy, dw, dh);
    },
  };

  const destPointInUnits = new Point(5, 0);
  const destSizeInUnits = new Size(2, 2);

  const renderer = new Renderer(new Size(20, 10), new Size(canvasEl.width, canvasEl.height));

  const sprite = Sprite.createFromArray(spriteFrames);
  const spriteAnimation = new SpriteAnimation({ sprite, isInfinite: true });

  let prevDate = new Date();

  const callback = () => {
    const newDate = new Date();
    const dt = newDate.getTime() - prevDate.getTime();

    spriteAnimation.update(dt);
    spriteAnimation.render({ context, renderer, destPointInUnits, destSizeInUnits });

    prevDate = newDate;

    requestAnimationFrame(() => callback());
  };

  requestAnimationFrame(() => callback());
};

document.body.appendChild(spriteImg);

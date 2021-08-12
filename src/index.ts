import './index.css';

import { spriteFrames, spriteUrl } from './assets';

import { SpriteAnimation } from './app/engine/sprite-animation';
import { IDrawable, IDrawParams } from './app/engine/drawable.interface';
import { Sprite } from './app/engine/sprite';

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

      const { sx, sy, sw, sh, dx, dy, dw, dh } = params;
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
    spriteAnimation.render({ context: drawableObj, dx: 0, dy: 0 });
    prevDate = newDate;

    requestAnimationFrame(() => callback());
  };

  requestAnimationFrame(() => callback());
};

document.body.appendChild(spriteImg);

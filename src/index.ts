import './index.css';

import { imgUrl, spriteFrames, spriteUrl } from './assets';
import { IDrawableSprite } from './app/engine/drawable-sprite.interface';
import { SpriteAnimation } from './app/engine/sprite-animation';

const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;

canvasEl.width = 640;
canvasEl.height = 480;

const context = canvasEl.getContext('2d');

const sprite = new Image();
sprite.src = spriteUrl;
sprite.onload = () => {
  document.body.removeChild(sprite);

  const drawableSprite: IDrawableSprite = {
    draw(sx: number, sy: number, sw: number, sh: number) {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);
      context.drawImage(sprite, sx, sy, sw, sh, 0, 0, 100, 110);
    },
  };

  const spriteAnimation = SpriteAnimation.createFromArray(spriteFrames, 10);

  let prevDate = new Date();

  const callback = () => {
    const newDate = new Date();
    const dt = newDate.getTime() - prevDate.getTime();
    spriteAnimation.update(dt);
    spriteAnimation.render(drawableSprite);
    prevDate = newDate;

    requestAnimationFrame(() => callback());
  };

  requestAnimationFrame(() => callback());
};

document.body.appendChild(sprite);

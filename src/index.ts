import './index.css';

import { crystalYellowSpriteUrl, crystalYellowSpriteFrames, levelDemoImgUrl, crystalSoundUrl } from './assets';

import { IDrawable, IDrawParams } from './app/engine/drawable.interface';

import { Point } from './app/engine/point';
import { Size } from './app/engine/size';

import { Renderer } from './app/engine/renderer';
import { Sprite } from './app/engine/sprite';
import { SpriteAnimation } from './app/engine/sprite-animation';

import { IResourceLoadRequest } from './app/ui/resource-loader/resource-load-request.interface';
import { ResourceLoader } from './app/ui/resource-loader/resource-loader';

const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;

canvasEl.width = 700;
canvasEl.height = 400;

const canvasContext = canvasEl.getContext('2d');

const loadRequest: IResourceLoadRequest = {
  imageUrls: [levelDemoImgUrl, crystalYellowSpriteUrl],
  audioUrls: [crystalSoundUrl],
};

ResourceLoader.getInstance()
  .load(loadRequest)
  .then(({ images, sounds }) => {
    const bgImg = images.find((i) => i.url === levelDemoImgUrl).element;
    const crystalSprite = images.find((i) => i.url === crystalYellowSpriteUrl).element;
    const crystalSound = sounds.find((i) => i.url === crystalSoundUrl).element;

    canvasEl.onclick = () => {
      crystalSound.play();
    };

    const context: IDrawable = {
      draw(params: IDrawParams) {
        canvasContext.fillStyle = '#000';
        canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);

        canvasContext.drawImage(bgImg, 0, 0);

        const { srcPoint, srcSize, distPoint, distSize } = params;

        const { x: sx, y: sy } = srcPoint;
        const { width: sw, height: sh } = srcSize;
        const { x: dx, y: dy } = distPoint;
        const { width: dw, height: dh } = distSize;

        canvasContext.drawImage(crystalSprite, sx, sy, sw, sh, dx, dy, dw, dh);
      },
    };

    const destPointInUnits = new Point(5, 0);
    const destSizeInUnits = new Size(2, 2);

    const renderer = new Renderer(new Size(20, 10), new Size(canvasEl.width, canvasEl.height));

    const sprite = Sprite.createFromArray(crystalYellowSpriteFrames);
    sprite.setReversedOrderOfFrames();

    const spriteAnimation = new SpriteAnimation({ sprite, speed: 20, isInfinite: true });

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
  });

import './index.css';

import { crystalYellowSpriteUrl, levelDemoImgUrl, crystalSoundUrl } from './assets';

import { IDrawParams, IDrawable } from './app/engine/core/interfaces/drawable.interface';

import { Point } from './app/engine/core/point';
import { Size } from './app/engine/core/size';
import { Img } from './app/engine/core/img';
import { Renderer } from './app/engine/core/renderer';

import { Crystal } from './app/game/crystal';

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
      drawImage(params: IDrawParams) {
        canvasContext.fillStyle = '#000';
        canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);

        canvasContext.drawImage(bgImg, 0, 0);

        const { image, srcPoint, srcSize, destPoint, destSize } = params;

        const { x: sx, y: sy } = srcPoint;
        const { width: sw, height: sh } = srcSize;
        const { x: dx, y: dy } = destPoint;
        const { width: dw, height: dh } = destSize;

        const imageElement = images.find((i) => i.url === image.id).element;
        canvasContext.drawImage(imageElement, sx, sy, sw, sh, dx, dy, dw, dh);
      },
    };

    const renderer = new Renderer(context, new Size(canvasEl.width, canvasEl.height), new Size(20, 10));

    const crystalSpriteImg = new Img(crystalYellowSpriteUrl, {
      width: crystalSprite.width,
      height: crystalSprite.height,
    });

    const crystal = new Crystal(crystalSpriteImg, new Point(5, 0), new Size(2, 2));

    let prevDate = new Date();

    const callback = () => {
      const newDate = new Date();
      const dt = newDate.getTime() - prevDate.getTime();

      crystal.update(dt);
      crystal.render(renderer);

      prevDate = newDate;

      requestAnimationFrame(() => callback());
    };

    requestAnimationFrame(() => callback());
  });

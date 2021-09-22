import { AbstractLoader } from './abstract-loader';

export class ImageLoader extends AbstractLoader<HTMLImageElement> {
  protected loadByUrl(url: string): Promise<HTMLImageElement> {
    if (!url) {
      throw new Error('Url is not specified.');
    }

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const imageElement = new Image();

      imageElement.onload = () => {
        this.handleImageLoad(url, imageElement);
        resolve(imageElement);
      };

      imageElement.onerror = (ev: ErrorEvent) => {
        this.handleImageLoad(url, imageElement);
        reject(ev);
      };

      imageElement.style.display = 'none';
      imageElement.src = url;

      document.body.appendChild(imageElement);
    });
  }

  private handleImageLoad(url: string, imageElement: HTMLImageElement): void {
    if (!url) {
      throw new Error('Url is not defined.');
    }

    if (!imageElement) {
      throw new Error('Image element is not defined.');
    }

    document.body.removeChild(imageElement);
    imageElement.removeAttribute('style');
  }
}

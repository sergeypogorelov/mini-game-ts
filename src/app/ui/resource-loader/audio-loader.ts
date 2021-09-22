import { AbstractLoader } from './abstract-loader';

export class AudioLoader extends AbstractLoader<HTMLAudioElement> {
  protected loadByUrl(url: string): Promise<HTMLAudioElement> {
    if (!url) {
      throw new Error('Url is not specified.');
    }

    return new Promise((resolve, reject) => {
      const audioElement = new Audio();

      audioElement.oncanplaythrough = () => {
        this.handleAudioLoad(url, audioElement);
        resolve(audioElement);
      };

      audioElement.onerror = (ev: ErrorEvent) => {
        this.handleAudioLoad(url, audioElement);
        reject(ev);
      };

      audioElement.controls = false;
      audioElement.preload = 'auto';
      audioElement.style.display = 'none';

      audioElement.src = url;

      document.body.appendChild(audioElement);
    });
  }

  private handleAudioLoad(url: string, audioElement: HTMLAudioElement): void {
    if (!url) {
      throw new Error('Url is not defined.');
    }

    if (!audioElement) {
      throw new Error('Audio element is not defined.');
    }

    if (document.body.contains(audioElement)) {
      document.body.removeChild(audioElement);
      audioElement.removeAttribute('style');
    }
  }
}

export abstract class AbstractLoader<T> {
  public get loading(): boolean {
    return this._loading;
  }

  public load(urls: string[]): Promise<T[]> {
    if (!urls) {
      throw new Error('URLs are not specified.');
    }

    if (this.loading) {
      throw new Error('Loading is already in progress.');
    }

    if (urls.length === 0) {
      return Promise.resolve<T[]>([]);
    }

    this._loading = true;

    const promises = urls.map((url) => this.loadByUrl(url));
    return Promise.all(promises).finally(() => (this._loading = false));
  }

  protected abstract loadByUrl(url: string): Promise<T>;

  private _loading = false;
}

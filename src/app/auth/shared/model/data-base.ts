export class DataWithCaptcha {
  captcha: string = '';

  resetCaptcha(): void {
    this.captcha = '';
  }

  snapshot(): any {
    return { 'recaptcha2-response': this.captcha };
  }

  valid(): boolean {
    return this.captcha.trim().length > 0;
  }
}

export class DataWithCaptchaAndPath extends DataWithCaptcha {
  private _path: string;

  constructor(path: string) {
    super();
    this._path = path;
  }

  get path(): string {
    return this._path;
  }

  snapshot(): any {
    return { ...super.snapshot(), path: this.path };
  }
}

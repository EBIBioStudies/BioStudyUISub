import { AppPath } from './app-path';

export function copyAndExtend(obj: any, extension: any): any {
  const copy = { ...obj };
  Object.keys(extension).forEach(k => copy[k] = extension[k]);

  return copy;
}

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
  private _path: AppPath;

  constructor(path: AppPath) {
    super();
    this._path = path;
  }

  get path(): string {
    return this._path.value;
  }

  snapshot(): any {
    return copyAndExtend(super.snapshot(), {'path': this.path});
  }
}

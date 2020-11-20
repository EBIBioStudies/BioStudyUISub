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
  private innerPath: string;

  constructor(path: string) {
    super();
    this.innerPath = path;
  }

  get path(): string {
    return this.innerPath;
  }

  snapshot(): any {
    return { ...super.snapshot(), path: this.path };
  }
}

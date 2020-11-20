import { DataWithCaptcha } from './data-base';

export class PasswordResetData extends DataWithCaptcha {
  key: string = '';
  password: string = '';
  passwordRepeat: string = '';

  snapshot(): { [key: string]: string } {
    return { ...super.snapshot(), activationKey: this.key, password: this.password };
  }
}

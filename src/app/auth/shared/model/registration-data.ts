import { AppPath } from './app-path';
import { DataWithCaptchaAndPath, copyAndExtend } from './data-base';

export class RegistrationData extends DataWithCaptchaAndPath {
  email: string = '';
  orcid: string = '';
  password: string = '';
  username: string = '';

  constructor() {
    super(new AppPath('#/activate'));
  }

  snapshot(): any {
    return copyAndExtend(super.snapshot(), {
      'aux': [`orcid:${this.orcid}`],
      'email': this.email,
      'password': this.password,
      'username': this.username
    });
  }
}

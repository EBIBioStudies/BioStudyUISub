import { AppPath } from './app-path';
import { DataWithCaptchaAndPath, copyAndExtend } from './data-base';

export class RegistrationData extends DataWithCaptchaAndPath {
  email: string = '';
  name: string = '';
  orcid: string = '';
  password: string = '';

  constructor() {
    super(new AppPath('#/activate'));
  }

  snapshot(): any {
    return copyAndExtend(super.snapshot(), {
      'aux': [`orcid:${this.orcid}`],
      'email': this.email,
      'password': this.password,
      'name': this.name
    });
  }
}

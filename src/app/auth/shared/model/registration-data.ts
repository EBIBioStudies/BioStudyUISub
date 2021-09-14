import { DataWithCaptchaAndPath } from './data-base';

export class RegistrationData extends DataWithCaptchaAndPath {
  email: string = '';
  name: string = '';
  orcid: string = '';
  password: string = '';

  constructor() {
    super('activate');
  }

  snapshot(): any {
    return {
      ...super.snapshot(),
      aux: [`orcid:${this.orcid}`],
      email: this.email,
      password: this.password,
      name: this.name,
      notificationsEnabled: true
    };
  }
}

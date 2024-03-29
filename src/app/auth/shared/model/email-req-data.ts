import { DataWithCaptchaAndPath } from './data-base';

class EmailRequestData extends DataWithCaptchaAndPath {
  email: string = '';

  constructor(pathAnchor: string) {
    super(pathAnchor);
  }

  snapshot(): { [key: string]: string } {
    return { ...super.snapshot(), email: this.email };
  }
}

export class PasswordResetRequestData extends EmailRequestData {
  constructor() {
    super('password_reset');
  }
}

export class ActivationLinkRequestData extends EmailRequestData {
  constructor() {
    super('activate');
  }
}

export class PasswordSetupRequestData extends EmailRequestData {
  constructor(email) {
    super('password_setup');

    this.email = email;
  }
}

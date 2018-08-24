import {AppPath} from './app-path';
import {DataWithCaptchaAndPath} from './data-base';

class EmailRequestData extends DataWithCaptchaAndPath {
    email: string = '';

    constructor(pathAncor: string) {
        super(new AppPath(pathAncor));
    }

    snapshot(): any {
        return super.snapshot().add('email', this.email);
    }
}

export class PasswordResetRequestData extends EmailRequestData {
    constructor() {
        super('#/password_reset');
    }
}

export class ActivationLinkRequestData extends  EmailRequestData {
    constructor() {
        super('#/activate');
    }
}
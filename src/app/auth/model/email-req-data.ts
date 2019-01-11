import {AppPath} from './app-path';
import {DataWithCaptchaAndPath} from './data-base';

class EmailRequestData extends DataWithCaptchaAndPath {
    email: string = '';

    constructor(pathAnchor: string) {
        super(new AppPath(pathAnchor));
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

export class ActivationLinkRequestData extends EmailRequestData {
    constructor() {
        super('#/activate');
    }
}
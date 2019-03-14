import {AppPath} from './app-path';
import {DataWithCaptchaAndPath, copyAndExtend} from './data-base';

class EmailRequestData extends DataWithCaptchaAndPath {
    email: string = '';

    constructor(pathAnchor: string) {
        super(new AppPath(pathAnchor));
    }

    snapshot(): { [key: string]: string } {
        return copyAndExtend(super.snapshot(), {'email': this.email});
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
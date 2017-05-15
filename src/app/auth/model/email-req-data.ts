import {Captcha} from './captcha';
import {AppPath} from './app-path';
import {WithSnapshot} from './with-snapshot';

class EmailRequestData extends WithSnapshot {
    email: string;

    private _captcha: Captcha = new Captcha();
    private _path: AppPath;

    constructor(pathAncor: string) {
        super();
        this._path = new AppPath(pathAncor);
    }

    get path(): string {
        return this._path.value;
    }

    get captcha(): string {
        return this._captcha.value;
    }

    set captcha(value: string) {
        this._captcha.value = value;
    }

    resetCaptcha(): void {
        this._captcha.reset();
    }

    snapshot(): any {
        return this.dataSnapshot(['email', 'captcha', 'path']);
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
import {Captcha} from './captcha';
import {AppPath} from "./app-path";

class EmailRequestData {
    email: string;

    private _captcha: Captcha = new Captcha();
    private _path: AppPath;

    constructor(pathAncor: string) {
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
        return this as {email: string, captcha: string, path: string};
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
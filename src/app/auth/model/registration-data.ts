import {Captcha} from './captcha';
import {AppPath} from './app-path';

export class RegistrationData {
    username: string = '';
    password: string = '';
    email: string = '';
    orcid: string = '';

    private _captcha: Captcha = new Captcha();
    private _path: AppPath = new AppPath('#/activate');

    get path(): string {
        return this._path.value;
    }

    get captcha(): string {
        return this._captcha.value;
    }

    set captcha(value: string) {
        this._captcha.value = value;
    }

    valid(): boolean {
        return this._captcha.hasValue();
    }

    resetCaptcha(): void {
        this._captcha.reset();
    }

    snapshot(): any {
        return this as { username: string, password: string, email: string, orcid: string, captcha: string, path: string };
    }
}
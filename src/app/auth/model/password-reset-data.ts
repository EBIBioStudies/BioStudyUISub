import {Captcha} from './captcha';

export class PasswordResetData {
    key: string = '';
    password: string = '';
    passwordRepeat: string = '';

    private _captcha: Captcha = new Captcha();

    get captcha(): string {
        return this._captcha.value;
    }

    set captcha(value: string) {
        this._captcha.value = value;
    }

    resetCaptcha(): void {
        this._captcha.reset();
    }

    valid(): boolean {
        if (!this._captcha.hasValue()) {
            console.error("Recaptcha field is required.");
            return false;
        }

        if (this.password.length < 6) {
            console.error("password length validation broken. 6 chars is a minimum");
            return false;
        }

        if (this.password !== this.passwordRepeat) {
            console.error("password validation broken. Passwords do not match.");
            return false;
        }
        return true;
    }

    snapshot(): any {
        return this as {key: string, password: string, captcha: string};
    }
}
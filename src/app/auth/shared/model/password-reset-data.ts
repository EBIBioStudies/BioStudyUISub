import { DataWithCaptcha, copyAndExtend } from './data-base';

export class PasswordResetData extends DataWithCaptcha {
    key: string = '';
    password: string = '';
    passwordRepeat: string = '';

    valid(): boolean {
        if (super.valid) {
            return false;
        }

        if (this.password.length < 6) {
            return false;
        }

        if (this.password !== this.passwordRepeat) {
            return false;
        }

        return true;
    }

    snapshot(): { [key: string]: string } {
        return copyAndExtend(super.snapshot(), {'activationKey': this.key, 'password': this.password});
    }
}

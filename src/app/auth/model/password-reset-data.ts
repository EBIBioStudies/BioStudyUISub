import {DataWithCaptcha} from './data-base';

export class PasswordResetData extends DataWithCaptcha {
    key: string = '';
    password: string = '';
    passwordRepeat: string = '';

    valid(): boolean {
        if (super.valid) {
            console.error('Recaptcha field is required.');
            return false;
        }

        if (this.password.length < 6) {
            console.error('password length validation broken. 6 chars is a minimum');
            return false;
        }

        if (this.password !== this.passwordRepeat) {
            console.error('password validation broken. Passwords do not match.');
            return false;
        }
        return true;
    }

    snapshot(): any {
        return super.snapshot().add('key', this.key).add('password', this.password);
    }
}
import { AppPath } from './app-path';
import { DataWithCaptchaAndPath, copyAndExtend } from './data-base';

export class RegistrationData extends DataWithCaptchaAndPath {
    username: string = '';
    password: string = '';
    email: string = '';
    orcid: string = '';

    constructor() {
        super(new AppPath('#/activate'));
    }

    snapshot(): any {
        return copyAndExtend(super.snapshot(), {
            'username': this.username,
            'password': this.password,
            'email': this.email,
            'aux': [`orcid:${this.orcid}`]
        });
    }
}

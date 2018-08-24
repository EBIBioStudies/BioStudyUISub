import {AppPath} from './app-path';
import {DataWithCaptchaAndPath} from './data-base';

export class RegistrationData extends DataWithCaptchaAndPath {
    username: string = '';
    password: string = '';
    email: string = '';
    orcid: string = '';

    constructor() {
        super(new AppPath('#/activate'));
    }

    snapshot(): any {
        return this.snapshot()
            .add('username', this.username)
            .add('password', this.password)
            .add('email', this.email)
            .add('orcid', this.orcid);
    }
}
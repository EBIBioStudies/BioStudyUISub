import {Component, Inject, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng2-recaptcha';

import {AuthService, RegistrationData} from '../../auth/index'

import tmpl from './signup.component.html'

@Component({
    selector: 'user-signup',
    template: tmpl
})

export class SignUpComponent {
    private model = new RegistrationData();
    private error: any = null;
    private success: boolean = false;

    @ViewChild('recaptcha') private recaptcha: RecaptchaComponent;

    constructor(@Inject(AuthService) private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.success = false;
        this.error = null;

        this.authService
            .signUp(this.model)
            .subscribe(
                (data) => {
                    this.success = true;
                },
                (error) => {
                    this.error = {status: 'Error', message: error.message};
                    this.recaptcha.reset();
                }
            );
    }

    onChange() {
        this.error = null;
    }
}

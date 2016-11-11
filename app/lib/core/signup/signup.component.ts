import {Component, Inject} from '@angular/core';

import {AuthService} from '../../auth/auth.service'
import {RegistrationData} from '../../auth/registration-data';

import tmpl from './signup.component.html'

@Component({
    selector: 'user-signup',
    template: tmpl
})

export class SignUpComponent {
    model = new RegistrationData();
    error: any = null;
    success: boolean = false;

    constructor(@Inject(AuthService) private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();
        this.success = false;
        this.error = null;

        this.authService
            .signUp(this.model)
            .then(function (data) {
                if (data.status === 'OK') {
                    this.success = true;
                } else {
                    console.error('error sign up', data);
                    this.error = {status: 'Error', message: data.message};
                    //todo: vcRecaptchaService.reload();
                }
            });
    }

    resetError() {
        this.error = null;
    }

}

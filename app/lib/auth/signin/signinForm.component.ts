import {Component, Inject} from '@angular/core';

import {Credentials} from '../credentials'
import {AuthService} from '../auth.service';

import tmpl from './signinForm.component.html'

@Component({
    selector: 'signin-form',
    template: tmpl
})

export class SignInFormComponent {
    model = new Credentials('', '');
    error: any = null;

    constructor(@Inject(AuthService) private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.error = null;

        this.authService
            .signIn(this.model)
            .subscribe(
                data => {
                    if (data.status === 'OK') {
                        // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                    } else {
                        // $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        this.error = {status: 'Error', message: data.message};
                    }
                },
                error => this.error = <any>error
            );
    }

    resetError() {
        this.error = null;
    };
}
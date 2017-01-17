import {Component, Inject, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng2-recaptcha';
import {Router} from '@angular/router';

import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';
import {RegistrationData} from '../registration-data';

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

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(UserSession) private session: UserSession,
                @Inject(Router) private router: Router) {
    }

    ngOnInit() {
        if (!this.session.isAnonymous()) {
            this.router.navigate(['']);
        }
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

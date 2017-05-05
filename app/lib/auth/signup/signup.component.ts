import {Component, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng2-recaptcha';
import {Router} from '@angular/router';

import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';
import {RegistrationData} from '../registration-data';

@Component({
    selector: 'user-signup',
    templateUrl: './signup.component.html'
})

export class SignUpComponent {
    private model = new RegistrationData();
    private error: any = null;
    private success: boolean = false;

    @ViewChild('recaptcha') private recaptcha: RecaptchaComponent;

    constructor(private authService: AuthService,
                private session: UserSession,
                private router: Router) {
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

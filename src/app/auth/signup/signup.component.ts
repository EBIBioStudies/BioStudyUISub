import {Component, ViewChild} from '@angular/core';
import {Response} from '@angular/http';
import {RecaptchaComponent} from 'ng-recaptcha';
import {Router} from '@angular/router';

import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';
import {RegistrationData} from '../registration-data';
import {ServerError} from '../../http/index';

@Component({
    selector: 'auth-signup',
    templateUrl: './signup.component.html'
})
export class SignUpComponent {
    private model = new RegistrationData();

    error: ServerError = null;
    success: boolean = false;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

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
                (error: Response) => {
                    this.error = ServerError.fromResponse(error).data;
                    this.recaptcha.reset();
                }
            );
    }

    onChange(): void {
        this.error = null;
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}

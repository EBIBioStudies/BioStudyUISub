import {
    AfterViewInit,
    Component, ElementRef,
    ViewChild
} from '@angular/core';

import {Router} from '@angular/router';

import {RecaptchaComponent} from 'ng-recaptcha';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';
import {RegistrationData} from '../model/registration-data';

@Component({
    selector: 'auth-signup',
    templateUrl: './signup.component.html'
})
export class SignUpComponent implements AfterViewInit {
    model: RegistrationData = new RegistrationData();

    error: ServerError = null;
    success: boolean = false;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    @ViewChild('focusEl')
    private focusEl: ElementRef;

    constructor(private authService: AuthService,
                private session: UserSession,
                private router: Router) {
    }

    //TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
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
                (error: ServerError) => {
                    this.error = error;
                    this.recaptcha.reset();
                    this.model.resetCaptcha();
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

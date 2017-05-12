import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import {RecaptchaComponent} from 'ng-recaptcha';

import {
    ActivatedRoute,
    Params
} from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
    selector: 'auth-passwd-reset',
    templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
    private model = {
        password1: '',
        password2: '',
        captcha: ''
    };
    private message: string = '';
    private key: string;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    hasError: boolean = false;
    showSuccess: boolean = false;

    constructor(private authService: AuthService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let key = params['key'];
            if (!key) {
                this.hasError = true;
                this.message = 'Invalid path';
            }
            this.key = key;
        });
    }

    onSubmit(event): void {
        event.preventDefault();

        if (this.model.password1 !== this.model.password2) {
            console.error("password validation broken. Passwords do not match.");
            return;
        }
        if (this.model.password1.length < 6) {
            console.error("password length validation broken. 6 chars is a minimum");
            return;
        }
        this.hasError = false;
        this.message = "";
        this.authService
            .passwordReset({key: this.key, password: this.model.password1, captcha: this.model.captcha})
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error) => {
                    this.hasError = true;
                    this.message = error.message;
                    this.recaptcha.reset();
                });
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
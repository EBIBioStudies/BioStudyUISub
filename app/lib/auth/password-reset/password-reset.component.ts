import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng2-recaptcha';

import {ActivatedRoute, Params} from '@angular/router';

import {AuthService} from '../auth.service';

import tmpl from './password-reset.component.html'

@Component({
    selector: 'passwd-reset',
    template: tmpl
})
export class PasswordResetComponent implements OnInit {
    private model = {
        password1: '',
        password2: '',
        recaptcha: ''
    };
    private hasError: boolean = false;
    private message: string = '';
    private showSuccess: boolean = false;

    private key: string;

    @ViewChild('recaptcha') private recaptcha: RecaptchaComponent;

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let key = params['key'];
            if (!key) {
                this.hasError = true;
                this.message = 'Invalid path';
            }
            this.key = key;
        });
    }

    onSubmit(event) {
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
            .passwordReset(this.key, this.model.password1, this.model.recaptcha)
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
}
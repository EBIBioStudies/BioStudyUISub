import {Component, Inject, OnInit} from '@angular/core';

import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Params} from '@angular/router';

import tmpl from './password-reset.component.html'

@Component({
    selector: 'passwd-reset',
    template: tmpl
})
export class PasswordResetComponent implements OnInit {
    password1: string = '';
    password2: string = '';
    recaptcha: string = '';
    hasError: boolean = false;
    message: string = '';
    showSuccess: boolean = false;

    private key:string;

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.params.forEach((params: Params) => {
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

        if (this.password1 !== this.password2) {
            console.error("password validation broken. Passwords do not match.");
            return;
        }
        if (this.password1.length < 6) {
            console.error("password length validation broken. 6 chars is a minimum");
            return;
        }
        this.hasError = false;
        this.message = "";
        this.authService
            .passwordReset(this.key, this.password1, this.recaptcha)
            .then(function (data) {
                console.debug(data);
                if (data.status === "OK") {
                    this.showSuccess = true;
                } else {
                    this.hasError = true;
                    this.message = data.message;
                }
            });
    }
}
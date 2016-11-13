import {Component, Inject, OnInit} from '@angular/core';

import {AuthService} from '../../auth/auth.service';

import tmpl from './password-reset-req.component.html'

@Component({
    selector: 'passwd-reset-req',
    template: tmpl
})
export class PasswordResetReqComponent implements OnInit {
    email: string = '';
    recaptcha: string = '';
    message: string = '';
    hasError: boolean = false;
    showSuccess: boolean = false;

    constructor(@Inject(AuthService) private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.message = '';
        this.hasError = false;

        this.authService.passwordResetRequest(this.email, this.recaptcha)
            .subscribe((data) => {
                    this.showSuccess = true;
                },
                (error) => {
                    this.hasError = true;
                    this.message = error.message;
                }
            );
    }
}
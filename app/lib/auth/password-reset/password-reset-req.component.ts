import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng2-recaptcha';

import {AuthService} from '../auth.service';

import tmpl from './password-reset-req.component.html'

@Component({
    selector: 'passwd-reset-req',
    template: tmpl
})
export class PasswordResetReqComponent implements OnInit {
    private model:any = {email: '', recaptcha: ''};
    private message: string = '';
    private hasError: boolean = false;
    private showSuccess: boolean = false;

    @ViewChild('recaptcha') private recaptcha: RecaptchaComponent;

    constructor(@Inject(AuthService) private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.message = '';
        this.hasError = false;

        this.authService.passwordResetRequest(this.model.email, this.model.recaptcha)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error) => {
                    this.hasError = true;
                    this.message = error.message;
                    this.recaptcha.reset();
                }
            );
    }
}
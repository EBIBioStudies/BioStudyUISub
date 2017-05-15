import {
    Component,
    ViewChild
} from '@angular/core';

import {Response} from '@angular/http';
import {RecaptchaComponent} from 'ng-recaptcha';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';
import {PasswordResetRequestData} from '../model/email-req-data';

@Component({
    selector: 'auth-passwd-reset-req',
    templateUrl: './password-reset-req.component.html'
})
export class PasswordResetReqComponent {
    hasError: boolean = false;
    showSuccess: boolean = false;

    model: PasswordResetRequestData = new PasswordResetRequestData();
    message: string = '';

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    constructor(private authService: AuthService) {
    }

    onSubmit(event): void {
        event.preventDefault();

        this.message = '';
        this.hasError = false;

        this.authService.passwordResetReq(this.model)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error: Response) => {
                    this.hasError = true;
                    this.message = ServerError.fromResponse(error).message;
                    this.model.resetCaptcha();
                    this.recaptcha.reset();
                }
            );
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
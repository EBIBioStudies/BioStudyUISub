import {
    Component,
    ViewChild
} from '@angular/core';

import {Response} from '@angular/http';
import {RecaptchaComponent} from 'ng-recaptcha';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';

@Component({
    selector: 'auth-passwd-reset-req',
    templateUrl: './password-reset-req.component.html'
})
export class PasswordResetReqComponent {
    private model: any = {email: '', captcha: ''};
    private message: string = '';

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    hasError: boolean = false;
    showSuccess: boolean = false;

    constructor(private authService: AuthService) {
    }

    onSubmit(event): void {
        event.preventDefault();

        this.message = '';
        this.hasError = false;

        this.authService.passwordResetRequest(this.model)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error: Response) => {
                    this.hasError = true;
                    this.message = ServerError.fromResponse(error).message;
                    this.recaptcha.reset();
                }
            );
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
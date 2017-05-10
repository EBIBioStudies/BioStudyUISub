import {Component, ViewChild} from '@angular/core';
import {Response} from '@angular/http';
import {RecaptchaComponent} from 'ng2-recaptcha';

import {AuthService} from '../auth.service';
import {ServerError} from '../../http/index';

@Component({
    selector: 'auth-activation-resend',
    templateUrl: './resend-activation-link.component.html'
})
export class ResendActivationLinkComponent {
    private model = {email: "", captcha: ""};
    private message: string;

    hasError: boolean;
    showSuccess: boolean;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    constructor(private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.message = "";
        this.hasError = false;
        this.authService
            .resendActivationLink(this.model)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error: Response) => {
                    this.hasError = true;
                    this.message = ServerError.fromResponse(error).message;
                    this.recaptcha.reset();
                }
            )
    }
}
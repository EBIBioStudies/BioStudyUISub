import {
    Component,
    ViewChild
} from '@angular/core';

import {Response} from '@angular/http';
import {RecaptchaComponent} from 'ng-recaptcha';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';
import {ActivationLinkRequestData} from '../model/email-req-data';

@Component({
    selector: 'auth-activation-resend',
    templateUrl: './activation-link-req.component.html'
})
export class ActivationLinkReqComponent {
    hasError: boolean;
    showSuccess: boolean;

    model: ActivationLinkRequestData = new ActivationLinkRequestData();
    message: string;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    constructor(private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.message = '';
        this.hasError = false;
        this.authService
            .activationLinkReq(this.model)
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
            )
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
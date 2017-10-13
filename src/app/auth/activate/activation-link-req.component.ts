import {
    Component,
    ViewChild
} from '@angular/core';

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
    isSubmitting: boolean = false;

    model: ActivationLinkRequestData = new ActivationLinkRequestData();
    message: string;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    constructor(private authService: AuthService) {}

    /**
     * Handler for change event for form fields
     */
    onFieldChange(): void {
        this.hasError = false;
    }

    onSubmit(event) {
        const component = this;     //SelfSubscriber object overwrites context for "subscribe" method

        event.preventDefault();
        this.isSubmitting = true;

        this.message = '';
        this.hasError = false;
        this.authService
            .activationLinkReq(this.model)
            .subscribe(
                (data) => {
                    this.isSubmitting = false;
                    component.showSuccess = true;
                },
                (error: ServerError) => {
                    this.isSubmitting = false;
                    component.hasError = true;
                    component.message = error.data.message;
                    component.model.resetCaptcha();
                    component.recaptcha.reset();
                }
            )
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
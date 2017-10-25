import {
    AfterViewInit,
    Component, ElementRef,
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
export class ActivationLinkReqComponent implements AfterViewInit {
    hasError: boolean;
    showSuccess: boolean;
    isLoading: boolean = false;

    model: ActivationLinkRequestData = new ActivationLinkRequestData();
    message: string;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    @ViewChild('email')
    private focusEl: ElementRef;

    constructor(private authService: AuthService) {}

    //TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
    }

    /**
     * Handler for change event for form fields
     */
    onFieldChange(): void {
        this.hasError = false;
    }

    onSubmit(event) {
        const component = this;     //SelfSubscriber object overwrites context for "subscribe" method

        event.preventDefault();
        this.isLoading = true;

        this.message = '';
        this.hasError = false;
        this.authService
            .activationLinkReq(this.model)
            .subscribe(
                (data) => {
                    this.isLoading = false;
                    component.showSuccess = true;
                },
                (error: ServerError) => {
                    this.isLoading = false;
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
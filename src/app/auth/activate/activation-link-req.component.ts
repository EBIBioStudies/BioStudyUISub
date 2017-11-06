import {
    AfterViewInit,
    Component, ElementRef,
    ViewChild
} from '@angular/core';

import {RecaptchaComponent} from 'ng-recaptcha';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';
import {ActivationLinkRequestData} from '../model/email-req-data';
import {AbstractControl, NgForm} from "@angular/forms";

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

    @ViewChild('recaptchaEl')
    private recaptcha: RecaptchaComponent;

    @ViewChild('emailEl')
    private focusEl: ElementRef;

    constructor(private authService: AuthService) {}

    //TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
    }

    onSubmit(form:NgForm) {
        const component = this;     //SelfSubscriber object overwrites context for "subscribe" method

        this.resetGlobalError();

        //Makes request for login if all form fields completed satisfactorily
        if (form.valid) {
            this.isLoading = true;
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
                        component.resetRecaptcha(form.controls['captcha']);
                    }
                );

        //Validates in bulk if form incomplete
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({ onlySelf: true });
            });
        }
    }

    resetGlobalError() {
        this.hasError = false;
        this.message = '';
    }

    /**
     * Resets all aspects of the captcha widget.
     * @see {@link RecaptchaComponent}
     * @param {AbstractControl} control - Form control for the captcha.
     */
    resetRecaptcha(control:AbstractControl): void {

        //Resets captcha's component and model
        this.recaptcha.reset();
        this.model.resetCaptcha();

        //Resets the state of captcha's control
        control.markAsUntouched({onlySelf: true});
        control.markAsPristine({onlySelf: true});
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
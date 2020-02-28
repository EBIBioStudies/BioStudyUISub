import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { ActivationLinkRequestData } from '../shared/model';

@Component({
    selector: 'auth-activation-resend',
    templateUrl: './activation-link-req.component.html'
})
export class ActivationLinkReqComponent implements AfterViewInit {
    hasError: boolean = false;
    showSuccess: boolean = false;
    isLoading: boolean = false;

    model: ActivationLinkRequestData = new ActivationLinkRequestData();
    message: string = '';

    @ViewChild('recaptchaEl')
    private recaptchaRef?: RecaptchaComponent;

    @ViewChild('emailEl')
    private focusRef?: ElementRef;

    constructor(private authService: AuthService) {}

    // TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusRef!.nativeElement.focus();
    }

    onSubmit(form: NgForm) {
        this.resetGlobalError();

        if (form.valid) {
            // If reCAPTCHA resolves, the signup request is sent.
            this.recaptchaRef!.execute();
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({onlySelf: true});
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
     */
    resetRecaptcha(): void {
        this.recaptchaRef!.reset();
        this.model.resetCaptcha();
    }

    onRecaptchaResolved(): void {
        const component = this; // SelfSubscriber object overwrites context for "subscribe" method

        this.isLoading = true;
        this.authService
            .activationLinkReq(this.model)
            .subscribe(
                () => {
                    this.isLoading = false;
                    component.showSuccess = true;
                },
                (error: HttpErrorResponse) => {
                    this.isLoading = false;
                    component.hasError = true;
                    component.message = error.message;
                    component.resetRecaptcha();
                }
            );
    }
}

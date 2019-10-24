import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { PasswordResetRequestData } from '../shared/model';

@Component({
    selector: 'st-auth-passwd-reset-req',
    templateUrl: './password-reset-req.component.html'
})
export class PasswordResetReqComponent implements AfterViewInit {
    hasError: boolean = false;
    showSuccess: boolean = false;
    isLoading: boolean = false; // Flag indicating if login request in progress
    model: PasswordResetRequestData = new PasswordResetRequestData();
    message: string = '';

    @ViewChild('recaptchaEl')
    private recaptcha?: RecaptchaComponent;

    @ViewChild('emailEl')
    private focusRef?: ElementRef;

    constructor(private authService: AuthService) {
    }

    // TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusRef!.nativeElement.focus();
    }

    onSubmit(form: NgForm): void {
        const component = this; // SelfSubscriber object sometimes overwrites context for "subscribe" method

        this.resetGlobalError();

        // Makes request if all form fields completed satisfactorily
        if (form.valid) {
            this.isLoading = true;
            this.authService.sendPasswordResetRequest(this.model)
                .subscribe(
                    () => {
                        this.isLoading = false;
                        component.showSuccess = true;
                    },
                    (error: HttpErrorResponse) => {
                        this.isLoading = false;
                        component.hasError = true;
                        component.message = error.message;
                        component.resetRecaptcha(form.controls['captcha']);
                    }
                );

            // Validates in bulk if form incomplete
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({onlySelf: true});
            });
        }
    }

    resetGlobalError(): void {
        this.message = '';
        this.hasError = false;
    }

    /**
     * Resets all aspects of the captcha widget.
     * @see {@link RecaptchaComponent}
     * @param {AbstractControl} control - Form control for the captcha.
     */
    resetRecaptcha(control: AbstractControl): void {
        this.recaptcha!.reset();
        this.model.resetCaptcha();

        // Resets the state of captcha's control
        control.markAsUntouched({onlySelf: true});
        control.markAsPristine({onlySelf: true});
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}

import {
    AfterViewInit,
    Component, ElementRef,
    ViewChild
} from '@angular/core';

import {RecaptchaComponent} from 'ng-recaptcha';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';
import {PasswordResetRequestData} from '../model/email-req-data';

@Component({
    selector: 'auth-passwd-reset-req',
    templateUrl: './password-reset-req.component.html'
})
export class PasswordResetReqComponent implements AfterViewInit {
    hasError: boolean = false;
    showSuccess: boolean = false;

    model: PasswordResetRequestData = new PasswordResetRequestData();
    message: string = '';

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    @ViewChild('emailInput')
    private focusEl: ElementRef;

    constructor(private authService: AuthService) {}

    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
    }

    /**
     * Handler for change event for form fields
     */
    onFieldChange(): void {
        this.hasError = false;
    }

    onSubmit(event): void {
        const component = this;     //SelfSubscriber object overwrites context for "subscribe" method

        event.preventDefault();

        this.message = '';
        this.hasError = false;

        this.authService.passwordResetReq(this.model)
            .subscribe(
                (data) => {
                    component.showSuccess = true;
                },
                (error: ServerError) => {
                    component.hasError = true;
                    component.message = error.data.message;
                    component.model.resetCaptcha();
                    component.recaptcha.reset();
                }
            );
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
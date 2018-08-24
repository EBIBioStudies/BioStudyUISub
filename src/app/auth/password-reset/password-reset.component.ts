import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {RecaptchaComponent} from 'ng-recaptcha';

import {ActivatedRoute} from '@angular/router';

import {AuthService} from '../auth.service';
import {PasswordResetData} from '../model/password-reset-data';
import {AbstractControl, NgForm} from '@angular/forms';

@Component({
    selector: 'auth-passwd-reset',
    templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit, AfterViewInit {
    hasError: boolean = false;
    showSuccess: boolean = false;
    isLoading: boolean = false;

    model: PasswordResetData = new PasswordResetData();
    message: string = '';

    @ViewChild('recaptchaEl')
    private recaptcha?: RecaptchaComponent;

    @ViewChild('focusEl')
    private focusRef?: ElementRef;

    constructor(private authService: AuthService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        const key = this.activatedRoute.snapshot.paramMap.get('key');
        if (key === null) {
            this.hasError = true;
            this.message = 'Invalid path';
        } else {
            this.model.key = key;
        }
    }

    //TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusRef!.nativeElement.focus();
    }

    onSubmit(form:NgForm): void {
        this.resetGlobalError();

        //Makes request if all form fields completed satisfactorily
        if (form.valid) {
            this.isLoading = true;
            this.authService
                .passwordReset(this.model)
                .subscribe(
                    (data) => {
                        this.isLoading = false;
                        this.showSuccess = true;
                    },
                    (error) => {
                        this.isLoading = false;
                        this.hasError = true;
                        this.message = error.message;
                        this.resetRecaptcha(form.controls['captcha']);
                    });

        //Validates in bulk if form incomplete
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({ onlySelf: true });
            });
        }
    }

    resetGlobalError(): void {
        this.hasError = false;
        this.message = "";
    }

    /**
     * Resets all aspects of the captcha widget.
     * @see {@link RecaptchaComponent}
     * @param {AbstractControl} control - Form control for the captcha.
     */
    resetRecaptcha(control:AbstractControl): void {
        this.recaptcha!.reset();
        this.model.resetCaptcha();

        //Resets the state of captcha's control
        control.markAsUntouched({onlySelf: true});
        control.markAsPristine({onlySelf: true});
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
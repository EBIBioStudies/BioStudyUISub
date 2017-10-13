import {
    AfterViewInit,
    Component, ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';

import {RecaptchaComponent} from 'ng-recaptcha';

import {ActivatedRoute} from '@angular/router';

import {AuthService} from '../auth.service';
import {PasswordResetData} from '../model/password-reset-data';

@Component({
    selector: 'auth-passwd-reset',
    templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit, AfterViewInit {
    hasError: boolean = false;
    showSuccess: boolean = false;

    model: PasswordResetData = new PasswordResetData();
    message: string = '';

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    @ViewChild('focusEl')
    private focusEl: ElementRef;

    constructor(private authService: AuthService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        const key = this.activatedRoute.snapshot.paramMap.get('key');
        if (key === null) {
            this.hasError = true;
            this.message = 'Invalid path';
        }
        this.model.key = key;
    }

    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
    }

    onSubmit(event): void {
        event.preventDefault();

        if (!this.model.valid()) {
            return;
        }

        this.hasError = false;
        this.message = "";
        this.authService
            .passwordReset(this.model)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error) => {
                    this.hasError = true;
                    this.message = error.message;
                    this.model.resetCaptcha();
                    this.recaptcha.reset();
                });
    }

    onRecaptchaResolved(resp: string): void {
        this.model.captcha = resp;
    }
}
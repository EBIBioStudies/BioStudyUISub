import {Component, Inject, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng2-recaptcha';

import {AuthService} from '../auth.service';

@Component({
    selector: 'user-activation-resend',
    templateUrl: './resend-activation-link.component.html'
})
export class ResendActivationLinkComponent {
    private req = {email: "", recaptcha: ""};
    private message: string;
    private hasError: boolean;
    private showSuccess: boolean;

    @ViewChild('recaptcha') private recaptcha: RecaptchaComponent;

    constructor(@Inject(AuthService) private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.message = "";
        this.hasError = false;
        this.authService
            .resendActivationLink(this.req.email, this.req.recaptcha)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error) => {
                    this.hasError = true;
                    this.message = error.message;
                    this.recaptcha.reset();
                }
            )
    }
}
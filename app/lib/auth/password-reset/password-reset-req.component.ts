import {Component, ViewChild} from '@angular/core';
import {Response} from '@angular/http';
import {RecaptchaComponent} from 'ng2-recaptcha';

import {AuthService} from '../auth.service';
import {ServerError} from '../../http/index';

@Component({
    selector: 'passwd-reset-req',
    templateUrl: './password-reset-req.component.html'
})
export class PasswordResetReqComponent {
    private model: any = {email: '', captcha: ''};
    private message: string = '';

    hasError: boolean = false;
    showSuccess: boolean = false;

    @ViewChild('recaptcha')
    private recaptcha: RecaptchaComponent;

    constructor(private authService: AuthService) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.message = '';
        this.hasError = false;

        this.authService.passwordResetRequest(this.model)
            .subscribe(
                (data) => {
                    this.showSuccess = true;
                },
                (error: Response) => {
                    this.hasError = true;
                    this.message = ServerError.fromResponse(error).message;
                    this.recaptcha.reset();
                }
            );
    }
}
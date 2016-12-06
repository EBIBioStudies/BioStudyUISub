import {Component, Inject, OnInit} from '@angular/core';

import {Response} from '@angular/http';

import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Params} from '@angular/router';

import tmpl from './resend-activation-link.component.html'
@Component({
    selector: 'user-activation-resend',
    template: tmpl
})
export class ResendActivationLinkComponent implements OnInit {
    private req = {email: "", recaptcha: ""};
    private message: string;
    private hasError: boolean;
    private showSuccess: boolean;

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
    }

    onSubmit() {
        this.message = "";
        this.hasError = false;
        this.authService
            .resendActivationLink(this.req.email, this.req.recaptcha)
            .subscribe((data) => {
                if (data.status === 'OK') {
                    this.showSuccess = true;
                } else {
                    this.hasError = true;
                    this.message = data.message;
                }
            })
    }
}
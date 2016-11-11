import {Component, Inject, OnInit} from '@angular/core';

import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Params} from '@angular/router';

import tmpl from './activate.component.html'

@Component({
    selector: 'app-signin',
    template: tmpl
})
export class ActivateComponent implements OnInit {
    hasError:boolean = false;
    message:string = '';

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
    }

    ngOnInit() {
        let params = this.route.params.forEach((params:Params) => {
            let key = params['key'];
            if (!key) {
                this.hasError = true;
                this.message = 'Wrong url for registration';
            }

            this.authService.activate(key)
                .subscribe((data) => {
                    this.hasError = false;
                    this.message = 'Activation was successful';
                })
                .catch(function () {
                    this.hasError = true;
                    this.message = 'Activation link is not correct';
                });
        });
    }
}
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
    selector: 'user-activate',
    templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
    hasError: boolean = false;
    message: string = '';

    constructor(private authService: AuthService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let key = params['key'];
            if (!key) {
                this.hasError = true;
                this.message = 'Invalid path';
            } else {
                this.checkKey(key);
            }
        });
    }

    checkKey(key: string) {
        this.authService
            .activate(key)
            .subscribe(
                (data) => {
                    this.message = 'Activation was successful';
                },
                (error) => {
                    this.hasError = true;
                    this.message = error.message;
                });
    }
}
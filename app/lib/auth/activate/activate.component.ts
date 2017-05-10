import {Component, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {ActivatedRoute, Params} from '@angular/router';

import {AuthService} from '../auth.service';
import {ServerError} from '../../http/index';

@Component({
    selector: 'auth-activate',
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
                this.activate(key);
            }
        });
    }

    private activate(key: string) {
        this.authService
            .activate(key)
            .subscribe(
                (data) => {
                    this.message = 'Activation was successful';
                },
                (error: Response) => {
                    this.hasError = true;
                    this.message = ServerError.fromResponse(error).message;
                });
    }
}
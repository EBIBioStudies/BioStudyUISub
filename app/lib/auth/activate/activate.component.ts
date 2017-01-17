import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {AuthService} from '../auth.service';

import tmpl from './activate.component.html'

@Component({
    selector: 'user-activate',
    template: tmpl
})
export class ActivateComponent implements OnInit {
    private hasError:boolean = false;
    private message:string = '';


    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
    }

    ngOnInit() {
         this.route.params.forEach((params:Params) => {
            let key = params['key'];
            if (!key) {
                this.hasError = true;
                this.message = 'Invalid path';
            } else {
                this.checkKey(key);
            }
        });
    }

    checkKey(key:string) {
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
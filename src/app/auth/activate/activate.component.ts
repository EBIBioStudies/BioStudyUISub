import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared';
import { ServerError } from 'app/http';

@Component({
    selector: 'auth-activate',
    templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
    hasError: boolean = false;
    message: string = '';

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        const key = this.activatedRoute.snapshot.paramMap.get('key');

        if (key === null) {
            this.hasError = true;
            this.message = 'Invalid path';
        } else {
            this.activate(key);
        }
    }

    private activate(key: string): void {
        const component = this; // SelfSubscriber object overwrites context for "subscribe" method

        this.authService
            .activate(key)
            .subscribe(
                () => {
                    component.message = 'Activation was successful';
                },
                (error: ServerError) => {
                    component.hasError = true;
                    component.message = error.data.message;
                });
    }
}

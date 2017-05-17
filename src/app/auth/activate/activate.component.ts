import {
    Component,
    OnInit
} from '@angular/core';

import {Response} from '@angular/http';
import {ActivatedRoute} from '@angular/router';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';

@Component({
    selector: 'auth-activate',
    templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
    hasError: boolean = false;
    message: string = '';

    constructor(private authService: AuthService,
                private activatedRoute: ActivatedRoute) {
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
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Response} from '@angular/http';

import {ServerError} from 'app/http/index';

import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';

@Component({
    selector: 'auth-signin',
    templateUrl: './signin.component.html'
})
export class SignInComponent {
    model = {login: "", password: ""};
    error: ServerError = null;
    waiting: boolean = false;

    constructor(private authService: AuthService,
                private session: UserSession,
                private router: Router) {
    }

    ngOnInit() {
       if (!this.session.isAnonymous()) {
           this.router.navigate(['']);
       }
    }

    onSubmit(event) {
        event.preventDefault();

        if (this.waiting) {
            return;
        }
        this.error = null;
        this.waiting = true;

        this.authService
            .signIn(this.model)
            .subscribe(
                (data) => {
                    this.router.navigate(['/submissions']);
                },
                (error: Response) => {
                    this.waiting = false;
                    this.error = ServerError.fromResponse(error);
                }
            );
    }

    resetError() {
        this.error = null;
    };
}
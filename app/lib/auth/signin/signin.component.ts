import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';

@Component({
    selector: 'user-signin',
    templateUrl: './signin.component.html'
})

export class SignInComponent {
    private model = {login: "", password: ""};
    private error: any = null;
    private waiting: boolean = false;

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
            .signIn(this.model.login, this.model.password)
            .subscribe(
                (data) => {
                    this.router.navigate(['/submissions']);
                },
                (error) => {
                    this.waiting = false;
                    this.error = <any>error;
                }
            );
    }

    resetError() {
        this.error = null;
    };
}
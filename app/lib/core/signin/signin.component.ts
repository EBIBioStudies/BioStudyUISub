import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../auth/auth.service';

import tmpl from './signin.component.html'

@Component({
    selector: 'user-signin',
    template: tmpl
})

export class SignInComponent {
    private model = {login: "", password: ""};
    private error: any = null;

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(Router) private router: Router) {
    }

    onSubmit(event) {
        event.preventDefault();

        this.error = null;

        this.authService
            .signIn(this.model.login, this.model.password)
            .subscribe(
                (data) => {
                    this.router.navigate(['/submissions']);
                },
                (error) => this.error = <any>error
            );
    }

    resetError() {
        this.error = null;
    };
}
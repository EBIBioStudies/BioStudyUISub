import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {ServerError} from 'app/http/index';
import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';

@Component({
    selector: 'auth-signin',
    templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit, AfterViewInit {
    model = {login: "", password: ""};
    error: ServerError = null;
    waiting: boolean = false;

    @ViewChild('focusEl')
    private focusEl: ElementRef;

    constructor(private authService: AuthService,
                private session: UserSession,
                private router: Router) {
    }

    ngOnInit() {
       if (!this.session.isAnonymous()) {
           this.router.navigate(['']);
       }
    }

    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
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
                (error: ServerError) => {
                    this.waiting = false;
                    this.error = error;
                }
            );
    }

    resetError() {
        this.error = null;
    };
}

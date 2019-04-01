import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, UserSession} from 'app/auth/shared';

import {ServerError} from 'app/http';

@Component({
    selector: 'auth-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {
    model = {login: '', password: '', next: ''};      // Data model for the component's form
    error?: ServerError;             // Server response object in case of error
    isLoading = false;             // Flag indicating if login request in progress

    @ViewChild('focusEl')
    private focusRef?: ElementRef;

    constructor(private authService: AuthService,
                private session: UserSession,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        if (!this.session.isAnonymous()) {
            this.router.navigate(['']);
        }
    }

    // TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusRef!.nativeElement.focus();
    }

    onSubmit(form: NgForm) {
        this.resetGlobalError();
        const next = this.route.snapshot.paramMap.get('next') || '/submissions';

        // Makes request for login if all form fields completed satisfactorily
        if (form.valid) {
            this.isLoading = true;
            this.authService
                .signIn(this.model)
                .subscribe(
                    (data) => {
                        this.router.navigate( [next]);
                    },
                    (error: ServerError) => {
                        this.isLoading = false;
                        this.error = error;
                    }
                );

            // Validates in bulk if form incomplete
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({onlySelf: true});
            });
        }
    }

    resetGlobalError() {
        this.error = undefined;
    }
}

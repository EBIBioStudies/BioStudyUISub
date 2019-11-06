import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserSession } from 'app/auth/shared';
import { ServerError } from 'app/http';

@Component({
    selector: 'st-auth-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {
    error?: ServerError; // Server response object in case of error
    isLoading = false; // Flag indicating if login request in progress
    model = {login: '', password: '', next: ''}; // Data model for the component's form

    @ViewChild('focusEl')
    private focusRef?: ElementRef;

    constructor(private authService: AuthService,
                private session: UserSession,
                private router: Router,
                private route: ActivatedRoute) {
    }

    // TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusRef!.nativeElement.focus();
    }

    ngOnInit() {
        if (!this.session.isAnonymous()) {
            this.router.navigate(['']);
        }
    }

    onSubmit(form: NgForm) {
        this.resetGlobalError();
        const next = this.route.snapshot.paramMap.get('next') || '/submissions';

        // Makes request for login if all form fields completed satisfactorily
        if (form.valid) {
            this.isLoading = true;
            this.authService
                .login(this.model)
                .subscribe(
                    () => {
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

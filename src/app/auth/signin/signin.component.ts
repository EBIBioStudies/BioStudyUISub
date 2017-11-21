import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from "@angular/forms";

import {ServerError} from 'app/http/index';
import {AuthService} from '../auth.service';
import {UserSession} from '../user-session';

@Component({
    selector: 'auth-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {
    model = {login: "", password: ""};      //Data model for the component's form
    error: ServerError = null;              //Server response object in case of error
    isLoading: boolean = false;             //Flag indicating if login request in progress

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

    //TODO: Turn autofocus on render into a directive
    ngAfterViewInit(): void {
        this.focusEl.nativeElement.focus();
    }

    onSubmit(form: NgForm) {
        this.resetGlobalError();

        //Makes request for login if all form fields completed satisfactorily
        if (form.valid) {
            this.isLoading = true;
            this.authService
                .signIn(this.model)
                .subscribe(
                    (data) => {
                        this.router.navigate(['/submissions']);
                    },
                    (error: ServerError) => {
                        this.isLoading = false;
                        this.error = error;
                    }
                );

        //Validates in bulk if form incomplete
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({ onlySelf: true });
            });
        }
    }

    resetGlobalError() {
        this.error = null;
    }
}

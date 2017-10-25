import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
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
    isLoading: boolean = false;

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

    onSubmit(event) {
        event.preventDefault();

        this.error = null;
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
    }

    resetError() {
        this.error = null;
    };
}

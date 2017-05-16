import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {
    AuthService,
    UserSession
} from 'app/auth/index';

import {AppConfig} from 'app/app.config';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    navCollapsed: boolean = true;
    userLoggedIn: boolean = false;

    constructor(private session: UserSession,
                private router: Router,
                private authService: AuthService,
                private appConfig: AppConfig) {

        this.userLoggedIn = !this.session.isAnonymous();

        this.session.created$.subscribe(created => {
            const sessionExpired = this.userLoggedIn && !created;
            this.userLoggedIn = created;
            if (sessionExpired) {
                this.router.navigate(['/signin']);
            }
        });
    }

    signOut() {
        this.authService
            .signOut()
            .subscribe(()=>{});
    }

    toggleCollapsed() {
        this.navCollapsed = !this.navCollapsed;
    }

    get appVersion(): string {
        return this.appConfig.version;
    }
}
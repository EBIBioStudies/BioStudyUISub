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

    constructor(private session: UserSession,
                private router: Router,
                private authService: AuthService,
                private appConfig: AppConfig) {
    }

    signOut() {
        this.authService
            .signOut()
            .subscribe(data => {
                this.router.navigate(['/signin']);
            });
    }

    toggleCollapsed() {
        this.navCollapsed = !this.navCollapsed;
    }

    get appVersion(): string {
        return this.appConfig.version;
    }

    get userLoggedIn(): boolean {
        return !this.session.isAnonymous();
    }
}
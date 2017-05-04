import {Inject, Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService, UserSession, UserSessionEvents} from '../../auth/index';
import {AppConfig} from '../../app.config';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    private isNavCollapsed: boolean = true;
    private appVersion: string = '0.0.0';

    private userLoggedIn: boolean = false;

    constructor(sessionEvents: UserSessionEvents,
                private session: UserSession,
                private router: Router,
                private authService: AuthService,
                appConfig: AppConfig) {

        this.userLoggedIn = !session.isAnonymous();

        this.appVersion = appConfig.version;

        sessionEvents.userSessionCreated$.subscribe(created => {
            this.userLoggedIn = created;
            if (!created) {
                this.router.navigate(['/signin']);
            }
        });

    }

    signOut() {
        this.authService.signOut().subscribe(data => {
            this.router.navigate(['/signin']);
        });
    }

    toggleCollapsed() {
        this.isNavCollapsed = !this.isNavCollapsed;
    }
}
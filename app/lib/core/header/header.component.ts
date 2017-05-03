import {Inject, Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService, UserSession, UserSessionEvents} from '../../auth/index';
import {AppConfig} from '../../config/index';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    private isNavCollapsed: boolean = true;
    private appVersion: string = '0.0.0';

    private userLoggedIn: boolean = false;

    constructor(@Inject(UserSessionEvents) sessionEvents: UserSessionEvents,
                @Inject(UserSession) private session: UserSession,
                @Inject(Router) private router: Router,
                @Inject(AuthService) private authService: AuthService,
                @Inject(AppConfig) private appConfig: AppConfig) {

        this.userLoggedIn = !session.isAnonymous();

        sessionEvents.userSessionCreated$.subscribe(created => {
            this.userLoggedIn = created;
            if (!created) {
                this.router.navigate(['/signin']);
            }
        });

        this.appVersion = appConfig.version;
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
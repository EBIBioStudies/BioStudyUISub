import {
    ApplicationRef,
    Component,
    OnDestroy
} from '@angular/core';
import {
    Router,
    NavigationEnd,
    Event
} from '@angular/router';

import {
    AuthService,
    UserSession
} from 'app/auth/index';

import {AppConfig} from 'app/app.config';
import {RequestStatusService} from "../../http/request-status.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
    reqStatusSubs: Subscription;

    navCollapsed: boolean = true;
    userLoggedIn: boolean = false;
    userLoggingIn: boolean = false;
    userRegistering: boolean = false;
    isLoaderVisible: boolean = false;

    constructor(private userSession: UserSession,
                private router: Router,
                private authService: AuthService,
                private appConfig: AppConfig,
                private requestStatus: RequestStatusService,
                private appRef: ApplicationRef) {
        const header = this;

        this.userLoggedIn = !this.userSession.isAnonymous();

        //If the session has expired (hence destroyed), it updates the view.
        //NOTE: the component's context has to be closed in. Otherwise, "this" points to SafeSubscriber.
        this.userSession.created$.subscribe(created => {
            const sessionDestroyed = header.userLoggedIn && !created;

            header.userLoggedIn = created;

            //Since the session has been destroyed, it logs the user out.
            //NOTE: property change does not always trigger a view update. Hence the subsequent
            //forcing of change detection. //TODO: find out why this is.
            if (sessionDestroyed) {
                router.navigate(['/signin']).then(() => {
                    appRef.tick();
                    header.signOut();
                });
            }
        });

        //Updates the view's state whenever the current URL is among the login-related routes.
        this.router.events.subscribe((event: Event) => {
           if (event instanceof NavigationEnd) {
               header.userRegistering = router.url === '/signup';
               header.userLoggingIn = router.url === '/signin';
            }
        });

        //Shows visual feedback while the apps awaits request resolution.
        this.reqStatusSubs = this.requestStatus.whenStatusChanged.subscribe(hasPendingRequests => {
            header.isLoaderVisible = hasPendingRequests;
        });
    }

    get appVersion(): string {
        return this.appConfig.version;
    }

    signOut() {
        this.authService
            .signOut()
            .subscribe(
                ()=>{},
                (error)=> {
                    // fix this: 403 response should not be returned here
                    if (error.status === 403) {
                        this.userSession.destroy();
                    }
                });
    }

    toggleCollapsed() {
        this.navCollapsed = !this.navCollapsed;
    }

    ngOnDestroy(): void {
        this.reqStatusSubs.unsubscribe();
    }
}
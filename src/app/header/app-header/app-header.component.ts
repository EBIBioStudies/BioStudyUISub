import { ApplicationRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService, UserSession, UserData } from 'app/auth/shared';
import { RequestStatusService } from 'app/http/request-status.service';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnDestroy {
    reqStatusSubs: Subscription;
    navCollapsed = true;
    userLoggedIn = false;
    userLoggingIn = false;
    userRegistering = false;
    isPendingReq = false; // flags whether there is a transaction in progress (from anywhere in the app)
    isBusy = false; // flags whether there is a transaction triggered by this component
    profileTooltip = '';
    @ViewChild('logout') logout;
    @ViewChild('user') user;

    constructor(private userSession: UserSession,
                private userData: UserData,
                private router: Router,
                private authService: AuthService,
                private requestStatus: RequestStatusService,
                private appRef: ApplicationRef,
                private modalService: BsModalService) {
        const header = this;


        // If the session has expired (hence destroyed), it updates the view.
        // NOTE: the component's context has to be closed in. Otherwise, "this" points to SafeSubscriber.
        this.userSession.created$.subscribe(created => {
            const sessionDestroyed = header.userLoggedIn && !created;
            this.userLoggedIn = !this.userSession.isAnonymous();
            header.userLoggedIn = created;

            // Since the session has been destroyed, it logs the user out.
            // NOTE: property change does not always trigger a view update. Hence the subsequent
            // forcing of change detection. //TODO: find out why this is.
            if (sessionDestroyed) {
                router.navigate(['/signin']).then(() => {
                    appRef.tick();
                    header.signOut();
                });
            }
        });

        // Updates the view's state whenever the current URL is among the login-related routes.
        this.router.events.subscribe((event: Event) => {
           if (event instanceof NavigationEnd) {
               header.userRegistering = router.url === '/signup';
               header.userLoggingIn = router.url === '/signin';
            }
        });

        // Shows visual feedback while the apps awaits request resolution.
        this.reqStatusSubs = this.requestStatus.whenStatusChanged.subscribe(hasPendingRequests => {
            header.isPendingReq = hasPendingRequests;
        });
    }

    changeProfileTooltip() {
        this.profileTooltip = this.userSession.userName();
    }

    signOut() {
        this.isBusy = true;
        this.authService
            .signOut()
            .subscribe(
                () => { this.isBusy = false; },
                (error) => {
                    // fix this: 403 response should not be returned here
                    if (error.status === 403) {
                        this.userSession.destroy();
                    }
                    this.isBusy = false;
                });
    }

    toggleCollapsed() {
        this.navCollapsed = !this.navCollapsed;
    }

    submitFeedback() {
        window.location.href = 'mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool Feedback';
    }

    ngOnDestroy(): void {
        this.reqStatusSubs.unsubscribe();
    }
}

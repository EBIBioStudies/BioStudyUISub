import {ApplicationRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';

import {AuthService, UserSession} from 'app/auth/index';
import {RequestStatusService} from '../../http/request-status.service';
import {Subscription} from 'rxjs/Subscription';
import {UserData} from '../../auth/user-data';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnDestroy {
    reqStatusSubs: Subscription;
    secretId: string | undefined = '';                  //current user's secret ID

    navCollapsed: boolean = true;
    userLoggedIn: boolean = false;
    userLoggingIn: boolean = false;
    userRegistering: boolean = false;
    isPendingReq: boolean = false;          //flags whether there is a transaction in progress (from anywhere in the app)
    isBusy: boolean = false;                //flags whether there is a transaction triggered by this component

    @ViewChild('confirmDialog')
    confirmDialog?: ConfirmDialogComponent;

    constructor(private userSession: UserSession,
                private userData: UserData,
                private router: Router,
                private authService: AuthService,
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
            header.isPendingReq = hasPendingRequests;
        });

        //Updates the secret ID as soon as it becomes available.
        this.userData.whenFetched.subscribe(data => {
            this.secretId = this.userData.secretId;
        });
    }

    signOut() {
        this.isBusy = true;
        this.authService
            .signOut()
            .subscribe(
                () => {this.isBusy = false},
                (error) => {
                    // fix this: 403 response should not be returned here
                    if (error.status === 403) {
                        this.userSession.destroy();
                    }
                    this.isBusy = false;
                });
    }

    /**
     * Shows the modal with the user's secret ID.
     */
    showSecretModal() {
        this.confirm(
            'Your secret ID is: ' + this.secretId + '. It is normally required for FTP/Aspera transactions and when sharing submissions.',
            'Secret ID'
        );
    }

    /**
     * Renders the confirmation dialogue.
     * @param {string} message - Text to be shown within the dialogue's body section.
     * @param {string} title - Title for the modal.
     */
    confirm(text: string, title: string) {
        if (this.confirmDialog !== undefined) {
            this.confirmDialog.title = title;
            this.confirmDialog.confirm(text, false);
        }
    }

    toggleCollapsed() {
        this.navCollapsed = !this.navCollapsed;
    }

    ngOnDestroy(): void {
        this.reqStatusSubs.unsubscribe();
    }
}
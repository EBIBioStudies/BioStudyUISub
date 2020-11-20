import { ApplicationRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService, UserSession } from 'app/auth/shared';
import { RequestStatusInterceptorService } from 'app/core/interceptors/request-status-interceptor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'st-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {
  isBusy = false; // flags whether there is a transaction triggered by this component
  isPendingReq = false; // flags whether there is a transaction in progress (from anywhere in the app)
  @ViewChild('logout') logout;
  navCollapsed = true;
  reqStatusSubs: Subscription;
  @ViewChild('user', { static: true }) user;
  userLoggedIn = false;
  userLoggingIn = false;
  userRegistering = false;

  constructor(
    private userSession: UserSession,
    private router: Router,
    private authService: AuthService,
    private requestStatus: RequestStatusInterceptorService,
    private appRef: ApplicationRef
  ) {
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
          this.appRef.tick();
          header.signOut();
        });
      }
    });

    // Updates the view's state whenever the current URL is among the login-related routes.
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        header.userRegistering = router.url.includes('signup');
        header.userLoggingIn = router.url.includes('signin');
      }
    });

    // Shows visual feedback while the apps awaits request resolution.
    // TODO: RequestStatusInterceptorService is an interceptor and it should not be used
    //       to get general status from all the request coming out from the app.
    this.reqStatusSubs = this.requestStatus.whenStatusChanged.subscribe(hasPendingRequests => {
      header.isPendingReq = hasPendingRequests;
    });
  }

  get userDisplayName(): string {
    return this.userSession.getUserDisplayName();
  }

  ngOnDestroy(): void {
    this.reqStatusSubs.unsubscribe();
  }

  signOut(): void {
    this.isBusy = true;
    this.authService
      .logout()
      .subscribe(
        () => {
          this.isBusy = false;
          this.userSession.destroy();
        },
        () => {
          this.isBusy = false;
        });

    this.userSession.destroy();
  }

  submitFeedback(): void {
    window.location.href = 'mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool Feedback';
  }

  toggleCollapsed(): void {
    this.navCollapsed = !this.navCollapsed;
  }
}

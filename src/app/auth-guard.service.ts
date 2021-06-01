import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserSession } from 'app/auth/shared';
import { ErrorMessageService } from './core/errors/error-message.service';
import { NotificationService } from './core/notification/notification.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userSession: UserSession,
    private router: Router,
    private notifier: NotificationService,
    private messages: ErrorMessageService
  ) {}

  // tslint:disable-next-line: variable-name
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userSession.isAnonymous()) {
      this.router.navigate(['/signin'], { queryParams: { next: state.url } });

      if (this.userSession.hasSessionExpired()) {
        this.notifier.showInfo(this.messages.getSessionExpiredMessage());
      }

      return false;
    } else {
      return true;
    }
  }
}

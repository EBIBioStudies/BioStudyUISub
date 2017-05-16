import {Injectable} from '@angular/core';

import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import {UserSession} from './auth/user-session';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userSession: UserSession,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.userSession.isAnonymous()) {
            return true;
        }
        //TODO this.authService.redirectUrl = state.url;

        this.router.navigate(['/signin']);
        return false;
    }
}
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {UserSession} from './auth/user-session';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userSession: UserSession,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (!this.userSession.isAnonymous()) {
            return true;
        }
        //TODO this.authService.redirectUrl = url;

        this.router.navigate(['/signin']);

        return false;
    }
}
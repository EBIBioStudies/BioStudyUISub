import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { UserSession } from 'app/auth/shared';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userSession: UserSession,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.userSession.isAnonymous()) {
            this.router.navigate(['/signin', {next: state.url}]);
            return false;
        } else {
            return true;
        }
    }
}

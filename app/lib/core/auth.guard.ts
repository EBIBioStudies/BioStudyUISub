import {Injectable, Inject} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject(AuthService) private auth: AuthService,
                @Inject(Router) private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.auth.isAuthenticated()) {
            return true;
        }
        //TODO this.authService.redirectUrl = url;

        this.router.navigate(['/signin']);

        return false;
    }
}
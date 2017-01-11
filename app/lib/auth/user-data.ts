import {Injectable, Inject} from '@angular/core';

import {UserRole} from './user-role';
import {UserSessionEvents} from './user-session.events';
import {AuthService} from './auth.service';

@Injectable()
export class UserData {
    private _data: any = null;

    constructor(@Inject(UserSessionEvents) userSessionEvents: UserSessionEvents,
                @Inject(AuthService) authService: AuthService) {

        userSessionEvents.userSessionCreated$.subscribe((ev) => {
            this._data = null;
            authService.checkUser().subscribe(data => {
                console.log('data', data);
            });
        });

        userSessionEvents.userSessionDestroyed$.subscribe((ev) => {
            this._data = null;
        });
    }

    get key(): string {
        return this.data().key || '';
    }

    get name(): string {
        return this.data().name || '';
    }

    get email(): string {
        return this.data().email || '';
    }

    get orcid(): string {
        return this.data().orcid || '';
    }

    get role(): UserRole {
        return UserRole.Public;
    }

    private data(): any {
        return this._data || {};
    }
}
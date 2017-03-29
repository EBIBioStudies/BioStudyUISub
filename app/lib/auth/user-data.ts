import {Injectable, Inject} from '@angular/core';

import * as _ from 'lodash';

import {UserRole} from './user-role';
import {UserSessionEvents} from './user-session.events';
import {AuthService} from './auth.service';

@Injectable()
export class UserData {
    private d: any;

    constructor(@Inject(UserSessionEvents) userSessionEvents: UserSessionEvents,
                @Inject(AuthService) authService: AuthService) {

        userSessionEvents.userSessionCreated$.subscribe(created => {
            if (created) {
                this.data = null;
                authService.checkUser().subscribe(data => {
                    console.debug('UserData: loaded', data);
                    this.data = data;
                });
            } else {
                this.data = null;
            }
        });

        this.data = null;
    }

    get key(): string {
        return this.data.sessid || '';
    }

    get name(): string {
        return this.data.username || '';
    }

    get email(): string {
        return this.data.email || '';
    }

    get orcid(): string {
        return this.data.aux.orcid || '';
    }

    get role(): UserRole {
        return UserRole.Public;
    }

    private get data(): any {
        return this.d;
    }

    private set data(data: any) {
        this.d = _.assign({aux: {}}, data);
    }
}
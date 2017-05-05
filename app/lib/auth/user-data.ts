import {Injectable, Inject} from '@angular/core';

import * as _ from 'lodash';

import {UserRole} from './user-role';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';

@Injectable()
export class UserData {
    private d: any;

    constructor(userSession: UserSession,
                authService: AuthService) {

        userSession.created$.subscribe(created => {
            if (created) {
                this.data = null;
                authService.checkUser().subscribe(data => {
                    console.debug('UserData:', data);
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
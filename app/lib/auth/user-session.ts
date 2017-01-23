import {Injectable, Inject} from '@angular/core';

import {UserSessionEvents} from './user-session.events';

import {setUserCookies, getUserCookies, destroyUserCookies} from '../cookies/user-cookies';

@Injectable()
export class UserSession {

    constructor(@Inject(UserSessionEvents) private  sessionEvents: UserSessionEvents) {
    }

    // call it when the app is bootstrapped
    init() {
        if (!this.isAnonymous()) {
            this.sessionEvents.userSessionCreated(this.login());
        }
    }

    create(login, token) {
        setUserCookies(login, token);
        this.sessionEvents.userSessionCreated(login);
    }

    destroy() {
        destroyUserCookies();
        this.sessionEvents.userSessionDestroyed(this.login());
    }

    token(): string {
        return getUserCookies().token;
    }

    login(): string {
        return getUserCookies().login;
    }

    isAnonymous() {
        return this.token() === '';
    }
}
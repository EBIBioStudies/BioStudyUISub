import {Injectable, Inject} from '@angular/core';

import {UserSessionEvents} from './user-session.events';

import {setLoginToken, getLoginToken, destroyLoginToken, cleanUpOldCookies} from '../cookies/user-cookies';

@Injectable()
export class UserSession {

    constructor(@Inject(UserSessionEvents) private  sessionEvents: UserSessionEvents) {
    }

    // call it when the app is bootstrapped
    init() {
        cleanUpOldCookies(); // keep it for a while
        if (!this.isAnonymous()) {
            this.sessionEvents.userSessionCreated();
        }
    }

    create(token) {
        setLoginToken(token);
        this.sessionEvents.userSessionCreated();
    }

    destroy() {
        destroyLoginToken();
        this.sessionEvents.userSessionDestroyed();
    }

    token(): string {
        return getLoginToken();
    }

    isAnonymous() {
        return this.token() === '';
    }
}
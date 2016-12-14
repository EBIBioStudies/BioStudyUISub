import {Injectable, Inject} from '@angular/core';

import {lsStore, lsRemove, lsRetrieve} from './local-storage';
import {User} from './user';
import {UserSessionEvents} from './session.events';

const SESSION_KEY = "SESSION_DATA";

@Injectable()
export class UserSession {
    public user: User;

    constructor(@Inject(UserSessionEvents) private  sessionEvents: UserSessionEvents) {
        this.user = User.fromArray(lsRetrieve(SESSION_KEY)) || User.anonymous();
    }

    create(sessionId, name, email, orcid, userRole) {
        this.user = new User(sessionId, name, email, orcid, userRole);
        lsStore(SESSION_KEY, this.user.toArray());
        this.sessionEvents.userSessionCreated(this.user.name);
    }

    destroy() {
        let userName = this.user.name;
        lsRemove(SESSION_KEY);
        this.user = User.anonymous();
        this.sessionEvents.userSessionDestroyed(userName);
    }

    isAnonymous() {
        return this.user.isAnonymous();
    }
}
import {Injectable, Inject} from '@angular/core';

import {lsStore, lsRemove, lsRetrieve} from '../shared/local-storage';
import {User} from './user';

const SESSION_KEY = "SESSION_DATA";

@Injectable()
export class UserSession {
    public user: User;

    constructor() {
        this.user = User.fromArray(lsRetrieve(SESSION_KEY)) || User.anonymous();
    }

    create(sessionId, name, email, orcid, userRole) {
        this.user = new User(sessionId, name, email, orcid, userRole);
        lsStore(SESSION_KEY, this.user.toArray());
    }

    destroy() {
        lsRemove(SESSION_KEY);
        this.user = User.anonymous();
    }

    isAnonymous() {
        return this.user.isAnonymous();
    }
}
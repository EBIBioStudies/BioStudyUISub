import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    setLoginToken,
    getLoginToken,
    setUser,
    getUser,
    destroyLoginToken,
    destroyUser
} from './user-cookies';
import { UserInfo } from './model';

@Injectable()
export class UserSession {
    private sessionCreated = new Subject<boolean>();

    created$: Observable<boolean> = this.sessionCreated.asObservable();

    // call it when the app is bootstrapped
    init(): void {
        if (!this.isAnonymous()) {
            this.notifySessionCreated();
        }
    }

    create(user: any): UserInfo {
        this.update(user);
        this.notifySessionCreated();

        return user;
    }

    update(user: any): UserInfo {
        setLoginToken(user.sessid);
        setUser(user);

        return user;
    }

    destroy(): void {
        destroyLoginToken();
        destroyUser();
        this.notifySessionDestroyed();
    }

    token(): string {
        return getLoginToken();
    }

    userName(): string {
        return getUser().fullname != null ? getUser().fullname : getUser().username ;
    }

    isAnonymous(): boolean {
        return this.token() === '';
    }

    private notifySessionCreated(): void {
        this.sessionCreated.next(true);
    }

    private notifySessionDestroyed(): void {
        this.sessionCreated.next(false);
    }
}

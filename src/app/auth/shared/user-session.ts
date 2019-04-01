import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {
    setLoginToken,
    getLoginToken,
    setUserName,
    getUserName,
    destroyLoginToken,
    cleanUpOldCookies,
    destroyUserName
} from './user-cookies';

@Injectable()
export class UserSession {

    private sessionCreated = new Subject<boolean>();

    created$: Observable<boolean> = this.sessionCreated.asObservable();

    // call it when the app is bootstrapped
    init(): void {
        cleanUpOldCookies(); // keep it for a while
        if (!this.isAnonymous()) {
            this.notifySessionCreated();
        }
    }

    create(token: string, userName: string): void {
        setLoginToken(token);
        setUserName(userName);
        this.notifySessionCreated();
    }

    destroy(): void {
        destroyLoginToken();
        destroyUserName();
        this.notifySessionDestroyed();
    }

    token(): string {
        return getLoginToken();
    }

    userName(): string {
        return getUserName();
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

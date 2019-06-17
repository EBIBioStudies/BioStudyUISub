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

    create(user: any): void {
        this.update(user);
        this.notifySessionCreated();
    }

    update(user: any) {
        setLoginToken(user.sessid);
        setUser(user);
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

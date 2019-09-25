import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
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

    constructor(
        private appConfig: AppConfig
    ) {}

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

    update(user: any) {
        setLoginToken(user.sessid, this.appConfig.environment);
        setUser(user);

        return user;
    }

    destroy(): void {
        destroyLoginToken(this.appConfig.environment);
        destroyUser();
        this.notifySessionDestroyed();
    }

    token(): string {
        return getLoginToken(this.appConfig.environment);
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

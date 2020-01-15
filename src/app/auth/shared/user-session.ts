import { AppConfig } from 'app/app.config';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
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
  created$: Subject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private appConfig: AppConfig) {}

  create(user: UserInfo): UserInfo {
    this.update(user);
    this.notifySessionCreated();

    return user;
  }

  destroy(): void {
    destroyLoginToken(this.appConfig.environment);
    destroyUser();
    this.notifySessionDestroyed();
  }

  getUserEmail(): string {
    const { email } = getUser();
    return email;
  }

  // call it when the app is bootstrapped
  init(): void {
    if (!this.isAnonymous()) {
      this.notifySessionCreated();
    }
  }

  isAnonymous(): boolean {
    return this.token() === '';
  }

  token(): string {
    return getLoginToken(this.appConfig.environment);
  }

  update(user: any) {
    setLoginToken(user.sessid, this.appConfig.environment);
    setUser(user);

    return user;
  }

  userName(): string {
    const { username } = getUser();
    return username;
  }

  private notifySessionCreated(): void {
    this.created$.next(true);
  }

  private notifySessionDestroyed(): void {
    this.created$.next(false);
  }
}

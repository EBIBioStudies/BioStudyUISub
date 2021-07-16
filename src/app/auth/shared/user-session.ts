import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { UserCookies } from './user-cookies';
import { UserInfo } from './model';
import { isDefinedAndNotEmpty } from 'app/utils';
import { AppConfig } from 'app/app.config';

@Injectable()
export class UserSession {
  created$: Subject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private userCookies: UserCookies, private appConfig: AppConfig) {}

  create(user: UserInfo): UserInfo {
    this.update(user);
    this.notifySessionCreated();

    return user;
  }

  destroy(): void {
    this.userCookies.destroyLoginToken(this.appConfig.environment);
    this.userCookies.destroyUser();
    this.notifySessionDestroyed();
  }

  getUserDisplayName(): string {
    const { fullname, email } = this.userCookies.getUser();

    if (isDefinedAndNotEmpty(fullname)) {
      return fullname;
    }

    return email;
  }

  getUserEmail(): string {
    const { email } = this.userCookies.getUser();
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

  hasSessionExpired(): boolean {
    return this.userCookies.hasSessionExpired(this.appConfig.environment);
  }

  token(): string {
    return this.userCookies.getLoginToken();
  }

  update(user: any): any {
    this.userCookies.setLoginToken(user.sessid, this.appConfig.environment);
    this.userCookies.setUser(user);

    return user;
  }

  private notifySessionCreated(): void {
    this.created$.next(true);
  }

  private notifySessionDestroyed(): void {
    this.created$.next(false);
  }
}

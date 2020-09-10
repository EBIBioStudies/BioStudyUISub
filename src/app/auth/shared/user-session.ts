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
import { isDefinedAndNotEmpty } from 'app/utils';

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
    destroyLoginToken();
    destroyUser();
    this.notifySessionDestroyed();
  }

  getUserDisplayName(): string {
    const { fullname, email } = getUser();

    if (isDefinedAndNotEmpty(fullname)) {
      return fullname;
    }

    return email;
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
    return getLoginToken();
  }

  update(user: any) {
    setLoginToken(user.sessid);
    setUser(user);

    return user;
  }

  private notifySessionCreated(): void {
    this.created$.next(true);
  }

  private notifySessionDestroyed(): void {
    this.created$.next(false);
  }
}

import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from './model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserCookies {
  COOKIE_EXPIRES: number = 30;
  COOKIE_NAME: string = 'BioStudiesToken';
  COOKIE_PATH: string = '/';
  USER: string = 'BioStudiesUser';
  BACKEND_TOKEN_NAME: string = 'BIOSTDSESS';

  constructor(private cookieService: CookieService) {}

  destroyLoginToken(environment: string): void {
    this.cookieService.delete(this.COOKIE_NAME, this.COOKIE_PATH, undefined, true, 'Strict');
    this.cookieService.delete(this.getBackendCookieWithEnv(environment), this.COOKIE_PATH, undefined, true, 'Strict');
  }

  destroyUser(): void {
    localStorage.removeItem(this.USER);
  }

  getLoginToken(): string {
    return this.cookieService.get(this.COOKIE_NAME);
  }

  getUser(): UserInfo {
    return JSON.parse(localStorage.getItem(this.USER) || '{}');
  }

  hasSessionExpired(environment: string): boolean {
    const isUserStored = Object.keys(this.getUser()).length > 0;
    const isCookiePresent =
      this.cookieService.check(this.COOKIE_NAME) && this.cookieService.check(this.getBackendCookieWithEnv(environment));

    // If the app still has the user data but the cookie is not there, it considers the session has expired.
    return isUserStored && !isCookiePresent;
  }

  setLoginToken(token: string, environment: string): void {
    this.cookieService.set(this.COOKIE_NAME, token, this.COOKIE_EXPIRES, this.COOKIE_PATH, undefined, true, 'Strict');
    this.cookieService.set(
      this.getBackendCookieWithEnv(environment),
      token,
      this.COOKIE_EXPIRES,
      this.COOKIE_PATH,
      undefined,
      true,
      'Strict'
    );
  }

  setUser(user: UserInfo): void {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  private getBackendCookieWithEnv(environment: string): string {
    return `${this.BACKEND_TOKEN_NAME}-${environment}`;
  }
}

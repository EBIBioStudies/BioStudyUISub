import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from './model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserCookies {
  COOKIE_EXPIRES: number = 365;
  COOKIE_NAME: string = 'BioStudiesToken';
  COOKIE_PATH: string = '/';
  USER: string = 'BioStudiesUser';

  constructor(private cookieService: CookieService) {}

  destroyLoginToken(): void {
    this.cookieService.delete(this.COOKIE_NAME, this.COOKIE_PATH);
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

  setLoginToken(token: string): void {
    this.cookieService.set(this.COOKIE_NAME, token, this.COOKIE_EXPIRES, this.COOKIE_PATH);
  }

  setUser(user: UserInfo): void {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }
}

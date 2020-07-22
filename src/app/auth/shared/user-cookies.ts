import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserInfo } from './model';

const LOGIN_TOKEN_NAME = 'BioStudiesToken';
const USER = 'BioStudiesUser';
const COOKIE_PATH = '/';

export function setLoginToken(token: string): void {
  Cookie.set(LOGIN_TOKEN_NAME, token, 365, COOKIE_PATH);
}

export function getLoginToken(): string {
  return Cookie.get(LOGIN_TOKEN_NAME) || '';
}

export function destroyLoginToken(): void {
  Cookie.delete(LOGIN_TOKEN_NAME, COOKIE_PATH);
}

export function destroyUser(): void {
  localStorage.removeItem(USER);
}

export function setUser(user: UserInfo): void {
  localStorage.setItem(USER, JSON.stringify(user));
}

export function getUser(): UserInfo {
  return JSON.parse(localStorage.getItem(USER) || '{}');
}

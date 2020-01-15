import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserInfo } from './model';

const LOGIN_TOKEN_NAME = 'BIOSTDSESS';
const USER = 'BioStudiesUser';
const COOKIE_PATH = '/';

export function setLoginToken(token: string, environment: string): void {
  const cookieName = `${LOGIN_TOKEN_NAME}-${environment}`;

  Cookie.set(cookieName, token, 365, COOKIE_PATH);
}

export function getLoginToken(environment: string): string {
  const cookieName = `${LOGIN_TOKEN_NAME}-${environment}`;

  return Cookie.get(cookieName) || '';
}

export function destroyLoginToken(environment: string): void {
  const cookieName = `${LOGIN_TOKEN_NAME}-${environment}`;

  Cookie.delete(cookieName, COOKIE_PATH);
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

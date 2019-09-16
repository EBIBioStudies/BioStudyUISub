import { Cookie } from 'ng2-cookies/ng2-cookies';

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

    Cookie.delete(LOGIN_TOKEN_NAME, COOKIE_PATH);
}

export function destroyUser(): void {
    localStorage.removeItem(USER);
}
export function setUser(user: any): void {
    localStorage.setItem(USER, JSON.stringify(user));
}

export function getUser(): any {
    return JSON.parse(localStorage.getItem(USER) || '{}');
}

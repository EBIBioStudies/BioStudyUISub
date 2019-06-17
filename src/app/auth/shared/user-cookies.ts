import { Cookie } from 'ng2-cookies/ng2-cookies';

const LOGIN_TOKEN = 'BioStudiesToken';
const USER = 'BioStudiesUser';
const COOKIE_PATH = '/';


export function setLoginToken(token: string): void {
    Cookie.set(LOGIN_TOKEN, token, 365, COOKIE_PATH);
}

export function getLoginToken(): string {
    return Cookie.get(LOGIN_TOKEN) || '';
}

export function destroyLoginToken(): void {
    Cookie.delete(LOGIN_TOKEN, COOKIE_PATH);
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

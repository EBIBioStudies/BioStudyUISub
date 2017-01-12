import {Cookie} from 'ng2-cookies/ng2-cookies';

const AE_LOGGED_USER = "AeLoggedUser_";
const AE_LOGIN_TOKEN = "AeLoginToken_";

export function setUserCookies(login, token): void {
    Cookie.set(AE_LOGGED_USER, login, 30, '/');
    Cookie.set(AE_LOGIN_TOKEN, token, 30, '/');
}

export function getUserCookies(): any {
    return {
        login: Cookie.get(AE_LOGGED_USER) || '',
        token: Cookie.get(AE_LOGIN_TOKEN) || ''
    };
}

export function destroyUserCookies(): void {
    Cookie.delete(AE_LOGGED_USER);
    Cookie.delete(AE_LOGIN_TOKEN);
}
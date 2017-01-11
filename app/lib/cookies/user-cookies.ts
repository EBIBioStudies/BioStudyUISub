import {Cookie} from 'ng2-cookies/ng2-cookies';

const AE_LOGGED_USER = "AeLoggedUser";
const AE_LOGIN_TOKEN = "AeLoginToken";

export function setUserCookies(login, token): void {
    Cookie.set(AE_LOGGED_USER, login);
    Cookie.set(AE_LOGIN_TOKEN, token);
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
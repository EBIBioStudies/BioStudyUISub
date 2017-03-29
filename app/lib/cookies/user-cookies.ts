import {Cookie} from 'ng2-cookies/ng2-cookies';

const LOGIN_TOKEN = "BsstToken";
const PATH = '/';

export function setLoginToken(token): void {
    Cookie.set(LOGIN_TOKEN, token, 30, PATH);
}

export function getLoginToken(): string {
    return Cookie.get(LOGIN_TOKEN) || ''
}

export function destroyLoginToken(): string {
    return Cookie.delete(LOGIN_TOKEN, PATH) || ''
}

export function cleanUpOldCookies() {
    for (const name of ["AeLoggedUser_", "AeLoginToken_"]) {
        Cookie.delete(name, PATH);
    }
}
import {Cookie} from 'ng2-cookies/ng2-cookies';

const LOGIN_TOKEN = 'BsstToken';
const AE_COOKIES = ['AeLoggedUser_', 'AeLoginToken_'];
const PATH = '/';

/**
 * Stores the login token in LocalStorage to ensure authentication across different subdomains (or ports) remains separate.
 * NOTE: Local storage uses a separate definition of origins than cookis. Hence its use here.
 * @param {string} token - Request token.
 */
export function setLoginToken(token: string): void {
    localStorage.setItem(LOGIN_TOKEN, token);
}

/**
 * Retrieves the login token from LocalStorage.
 * @returns {string} - Request token. Empty string if not found.
 */
export function getLoginToken(): string {
    return localStorage.getItem(LOGIN_TOKEN) || '';
}

/**
 * Removes the login token from LocalStorage.
 */
export function destroyLoginToken(): void {
    localStorage.removeItem(LOGIN_TOKEN);
}

/**
 * Wipes out any ArrayExpress-related cookies.
 */
export function cleanUpOldCookies() {
    AE_COOKIES.forEach((name) => {
        Cookie.delete(name, PATH);
    });
}
import {Cookie} from 'ng2-cookies/ng2-cookies';

export function lsStore(key, obj) {
    var value = JSON.stringify(obj);
    try {
        localStorage.setItem(key, value);
    } catch (err) {
        console.warn('store: localStorage is not supported using cookies instead..');
        Cookie.set(key, value);
    }
}

export function lsRetrieve(key) {
    var data = null;
    try {
        data = localStorage.getItem(key);
    } catch (err) {
        console.warn('retrieve: localStorage is not supported using cookies instead..');
        data = Cookie.get(key);
    }
    return data === null ? null : JSON.parse(data);
}

export function lsRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.warn('remove: localStorage is not supported using cookies instead..');
        Cookie.delete(key);
    }

}
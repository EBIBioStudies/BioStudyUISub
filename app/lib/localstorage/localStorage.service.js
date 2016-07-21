export default class LocalStorageService {
    constructor($cookies, $window, $log) {
        'ngInject';

        this.$cookies = $cookies;
        this.localStorage = $window.localStorage;
        this.$log = $log;
    }

    store(key, obj) {
        var value = angular.toJson(obj);

        try {
            this.localStorage.setItem(key, value);
        } catch (err) {
            this.$log.warn('store: localStorage is not supported using cookies instead..');
            this.$cookies.put(key, value)
        }
    }

    retrieve(key) {
        var data = null;
        try {
            if (key in this.localStorage) {
                data = this.localStorage.getItem(key);
            }
        } catch (err) {
            this.$log.warn('retrieve: localStorage is not supported using cookies instead..');
            data = this.$cookies.get(key);
        }
        return data === null ? null : angular.fromJson(data);
    }

    remove(key) {
        try {
            if (key in this.localStorage) {
                this.localStorage.removeItem(key);
            }
        } catch (err) {
            this.$log.warn('remove: localStorage is not supported using cookies instead..');
            this.$cookies.remove(key);
        }
    }
}
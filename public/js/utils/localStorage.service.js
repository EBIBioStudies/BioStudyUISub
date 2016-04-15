'use strict';

module.exports =
    (function () {
        return ['$cookies', '$window', '$log',
            function ($cookies, $window, $log) {

                function store(key, obj) {
                    var value = angular.toJson(obj);

                    try {
                        $window.localStorage.setItem(key, value);
                    } catch (err) {
                        $log.warn("store: localStorage is not supported using cookies instead..");
                        $cookies.put(key, value)
                    }
                }

                function retrieve(key) {
                    var data = null;
                    try {
                        if (key in $window.localStorage) {
                            data = $window.localStorage.getItem(key);
                        }
                    } catch (err) {
                        $log.warn("retrieve: localStorage is not supported using cookies instead..");
                        data = $cookies.get(key);
                    }
                    return data === null ? null : angular.fromJson(data);
                }

                function remove(key) {
                    try {
                        if (key in $window.localStorage) {
                            $window.localStorage.removeItem(key);
                        }
                    } catch (err) {
                        $log.warn("remove: localStorage is not supported using cookies instead..");
                        $cookies.remove(key);
                    }
                }

                return {
                    store: store,
                    retrieve: retrieve,
                    remove: remove
                }
            }];
    })();

'use strict';

module.exports =
    (function () {

        return ['$http', '$q', '$rootScope', 'USER_ROLES', 'Session', 'AccessLevel', '$log',
            function ($http, $q, $rootScope, USER_ROLES, Session, AccessLevel, $log) {

                function signIn(credentials) {
                    var defer = $q.defer();
                    $http.post("/raw/auth/signin", credentials)
                        .success(function (result) {
                            if (result.status === $rootScope.Constants.Status.OK) {
                                Session.create(result.sessid, result.username, USER_ROLES.user);
                                defer.resolve(result);
                            }
                            else {
                                defer.reject({status: result.status, message: 'Wrong credentials'});
                            }
                        })
                        .error(function (err, status, headers) {
                            $log.error(status + ":" + err);
                            defer.reject({
                                status: status || 500,
                                message: 'Problem with connection to biostudy server'
                            });
                        });
                    return defer.promise;
                }

                function checkSession(sessionId) {
                    var defer = $q.defer();
                    $http.get("/raw/auth/check?format=json&BIOSTDSESS=" + sessionId)
                        .success(function (result) {
                            if (result.status === $rootScope.Constants.Status.OK) {
                                Session.create(sessionId, result.username, USER_ROLES.user);
                                defer.resolve(result);
                            } else {
                                defer.reject({status: result.status, message: result.message});
                            }
                        })
                        .error(function (err, status, headers) {
                            $log.error(status + ":" + err);
                            defer.reject({
                                status: status || 500,
                                message: 'Problem with connection to biostudy server'
                            });
                        });
                    return defer.promise;
                }

                function signOut() {
                    if (!isAuthenticated()) {
                        return $q.when({});
                    }

                    var defer = $q.defer();
                    $http.post("/api/auth/signout", Session.userName)
                        .success(function (result) {
                            Session.destroy();
                            defer.resolve({});
                        })
                        .error(function (err, status, headers) {
                            $log.error(status + ":" + err);
                            defer.reject(err);
                        });
                    return defer.promise;

                }

                function signUp(user) {
                    var defer = $q.defer();
                    $http.post("/api/auth/signup", user)
                        .success(function (result, status) {
                            if (result.status === $rootScope.Constants.Status.OK) {
                                defer.resolve(result);
                            } else {
                                $log.error("Error" + ":" + status + ":" + result);
                                defer.reject({status: result.status, message: result.status});
                            }
                        })
                        .error(function (err, status) {
                            defer.reject(err, status);
                        });
                    return defer.promise;
                }

                function activate(key) {
                    var defer = $q.defer();
                    $http.post("/raw/auth/activate/" + key)
                        .success(function (result) {
                            defer.resolve(result);
                        })
                        .error(function (err, status) {
                            defer.reject(err, status);
                        });
                    return defer.promise;
                }

                function isAuthenticated() {
                    return !Session.isAnonymous();
                }

                function isAuthorized(roles) {
                    if (!angular.isArray(roles)) {
                        roles = [roles];
                    }
                    return roles.indexOf(Session.userRole) !== -1;
                }

                function isAuthorizedAs(accessLevel) {
                    return isAuthorized(AccessLevel.roles(accessLevel));
                }

                return {
                    signIn: signIn,
                    signOut: signOut,
                    signUp: signUp,
                    checkSession: checkSession,
                    activate: activate,
                    isAuthenticated: isAuthenticated,
                    isAuthorized: isAuthorized,
                    isAuthorizedAs: isAuthorizedAs
                };
            }];

    })();


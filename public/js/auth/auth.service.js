'use strict';

module.exports =
    (function () {

        return ['$http', '$q', 'USER_ROLES', 'Session', 'AccessLevel', '$log', '$location',
            function ($http, $q, USER_ROLES, Session, AccessLevel, $log, $location) {

                function getAppPath() {
                    var re = new RegExp("https?:\/\/[^\/]+([^\\?#]*).*");
                    var m = re.exec($location.absUrl());
                    return m[1];
                }

                function signIn(credentials) {
                    var defer = $q.defer();
                    $http.post("/raw/auth/signin", credentials)
                        .then(
                            function (response) {
                                var data = response.data;
                                if (data.status === "OK") {
                                    Session.create(data.sessid, data.username, USER_ROLES.user);
                                    defer.resolve(data);
                                }
                                else {
                                    defer.reject({status: data.status, message: data.message});
                                }
                            },
                            function (response) {
                                var statusCode = response.status;
                                $log.error("login failure", response);
                                defer.reject({
                                    status: "*",
                                    message: statusCode === 403 ? 'Invalid credentials' : 'Server error. Please try later..'
                                });
                            });
                    return defer.promise;
                }

                function signOut() {
                    if (!isAuthenticated()) {
                        return $q.when({});
                    }
                    var defer = $q.defer();
                    $http.post("/api/auth/signout", {username: Session.userName})
                        .then(
                            function () {
                                Session.destroy();
                                defer.resolve({});
                            },
                            function (response) {
                                $log.error("logout failure", response);
                                defer.reject(err);
                            });
                    return defer.promise;
                }

                function signUp(user) {
                    var defer = $q.defer();
                    user.path = getAppPath() + "#/activate";
                    $http.post("/api/auth/signup", user)
                        .then(
                            function (response) {
                                defer.resolve(response.data);
                            },
                            function (response) {
                                if (response.status === 403) {
                                    defer.resolve(response.data);
                                }
                                defer.reject(response);
                            });
                    return defer.promise;
                }

                function activate(key) {
                    var defer = $q.defer();
                    $http.post("/raw/auth/activate/" + key)
                        .then(
                            function (response) {
                                defer.resolve(response.data);
                            },
                            function (response) {
                                defer.reject(response);
                            });
                    return defer.promise;
                }

                function passwordResetRequest(email, recaptcha) {
                    var defer = $q.defer();
                    var path = getAppPath() + "#/change_password";
                    $http.post("/api/auth/passrstreq/", {email: email, 'recaptcha2-response': recaptcha, path: path})
                        .then(
                            function (response) {
                                defer.resolve(response.data);
                            },
                            function (response) {
                                if (response.status === 403) {
                                    defer.resolve(response.data);
                                }
                                defer.reject(response);
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
                    activate: activate,
                    passwordResetRequest: passwordResetRequest,
                    isAuthenticated: isAuthenticated,
                    isAuthorized: isAuthorized,
                    isAuthorizedAs: isAuthorizedAs
                };
            }];

    })();


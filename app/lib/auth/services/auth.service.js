export default class AuthService {
    constructor($http, $q, USER_ROLES, Session, AccessLevel, $log, $location) {
        "ngInject";

        function getAppPath() {
            var re = new RegExp("https?:\/\/[^\/]+([^\\?#]*).*");
            var m = re.exec($location.absUrl());
            return m[1];
        }

        Object.assign(this, {
            signIn(credentials) {
                var defer = $q.defer();
                $http.post("/raw/auth/signin", credentials)
                    .then(
                        function (response) {
                            var data = response.data;
                            if (data.status === "OK") {
                                Session.create(data.sessid, data.username, data.email || "", USER_ROLES.user);
                            }
                            defer.resolve(data);
                        },
                        function (response) {
                            if (response.status === 403) {
                                response.data.message = "Invalid credentials";
                                defer.resolve(response.data);
                                return;
                            }
                            $log.error("login error", response);
                            defer.reject(response);
                        });
                return defer.promise;
            },

            signOut() {
                if (!this.isAuthenticated()) {
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
                            $log.error("logout error", response);
                            defer.reject(response);
                        });
                return defer.promise;
            },

            signUp(user) {
                var defer = $q.defer();
                user.path = getAppPath() + "#/activate";
                $http.post("/api/auth/signup", user)
                    .then(
                        function (response) {
                            defer.resolve(response.data);
                        },
                        function (response) {
                            if (response.status === 403 || response.status === 400) {
                                defer.resolve(response.data);
                                return;
                            }
                            $log.error("signup error", response);
                            defer.reject(response);
                        });
                return defer.promise;
            },

            activate(key) {
                var defer = $q.defer();
                $http.post("/raw/auth/activate/" + key)
                    .then(
                        function (response) {
                            defer.resolve(response.data);
                        },
                        function (response) {
                            $log.error("activate error", response);
                            defer.reject(response);
                        });
                return defer.promise;
            },

            passwordResetRequest(email, recaptcha) {
                var defer = $q.defer();
                var path = getAppPath() + "#/password_reset";
                $http.post("/api/auth/passrstreq/", {email: email, path: path, 'recaptcha2-response': recaptcha})
                    .then(
                        function (response) {
                            defer.resolve(response.data);
                        },
                        function (response) {
                            if (response.status === 403) {
                                defer.resolve(response.data);
                                return;
                            }
                            $log.error("password reset request error", response);
                            defer.reject(response);
                        });
                return defer.promise;
            },

            passwordReset(key, password, recaptcha) {
                var defer = $q.defer();
                $http.post("/raw/auth/passreset/", {key: key, password: password, 'recaptcha2-response': recaptcha})
                    .then(
                        function (response) {
                            defer.resolve(response.data);
                        },
                        function (response) {
                            if (response.status === 400) { //invalid request
                                defer.resolve(response.data);
                                return;
                            }
                            $log.error("password reset error", response);
                            defer.reject(response);
                        });
                return defer.promise;
            },

            isAuthenticated() {
                return !Session.isAnonymous();
            },

            isAuthorized(roles) {
                if (!angular.isArray(roles)) {
                    roles = [roles];
                }
                return roles.indexOf(Session.userRole) !== -1;
            },

            isAuthorizedAs(accessLevel) {
                return isAuthorized(AccessLevel.roles(accessLevel));
            }
        });

    }
}

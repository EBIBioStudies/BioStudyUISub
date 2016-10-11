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
                return $http.post("/raw/auth/signin", credentials)
                    .then(
                        (response) => {
                            var data = response.data;
                            if (data.status === "OK") {
                                var orcid = data.aux ? data.aux.orcid : "";
                                Session.create(data.sessid, data.username, data.email || "", USER_ROLES.user, orcid);
                            }
                            return data;
                        },
                        (response) => {
                            if (response.status === 403) {
                                response.data.message = "Invalid credentials";
                                return response.data;
                            }
                            $log.error("login error", response);
                            return $q.reject(response);
                        });
            },

            signOut() {
                if (!this.isAuthenticated()) {
                    return $q.when({});
                }
                return $http.post("/api/auth/signout", {username: Session.userName})
                    .then(
                        () => {
                            Session.destroy();
                            return {};
                        },
                        (response) => {
                            $log.error("logout error", response);
                            return $q.reject(response);
                        });
            },

            signUp(user) {
                user.path = getAppPath() + "#/activate";
                return $http.post("/api/auth/signup", user)
                    .then(
                        (response) => {
                            return response.data;
                        },
                        (response) => {
                            if (response.status === 403 || response.status === 400) {
                                return response.data;
                            }
                            $log.error("signup error", response);
                            return $q.reject(response);
                        });
            },

            activate(key) {
                return $http.post("/raw/auth/activate/" + key)
                    .then(
                        (response) => {
                            return response.data;
                        },
                        (response) => {
                            $log.error("activate error", response);
                            return $q.reject(response);
                        });
            },

            passwordResetRequest(email, recaptcha) {
                var path = getAppPath() + "#/password_reset";
                return $http.post("/api/auth/passrstreq/", {email: email, path: path, 'recaptcha2-response': recaptcha})
                    .then(
                        (response) => {
                            return response.data;
                        },
                        (response) => {
                            if (response.status === 403) {
                                return response.data;
                            }
                            $log.error("password reset request error", response);
                            return $q.reject(response);
                        });
            },

            resendActivationLink(email, recaptcha) {
                var path = getAppPath() + "#/activate";
                return $http.post("/api/auth/resendActLink/", {email: email, path: path, 'recaptcha2-response': recaptcha})
                    .then(
                        (response) => {
                            return response.data;
                        },
                        (response) => {
                            if (response.status === 403) {
                                return response.data;
                            }
                            $log.error("resend activation link error", response);
                            return $q.reject(response);
                        });
            },

            passwordReset(key, password, recaptcha) {
                return $http.post("/raw/auth/passreset/", {
                    key: key,
                    password: password,
                    'recaptcha2-response': recaptcha
                })
                    .then(
                        (response) => {
                            return response.data;
                        },
                        (response) => {
                            if (response.status === 400) { //invalid request
                                return response.data;
                            }
                            $log.error("password reset error", response);
                            return q$.reject(response);
                        });
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

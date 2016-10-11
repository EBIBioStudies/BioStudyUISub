import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';

import { HttpClient } from '../http/http-client'
import { Observable } from 'rxjs/Observable';

import {Credentials} from './credentials';

@Injectable()
export class AuthService {
    constructor(@Inject(HttpClient)private http: HttpClient) {}

    signIn(credentials: Credentials): Observable<any> {
        return this.http.post('/raw/auth/signin', credentials.stringify())
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                   // Session.create(data.sessid, data.username, data.email || "", USER_ROLES.user);
                }
                return data;
        })
            .catch((error: any) => {
            if (error.status === 403) {
                return {status: 'Error', message: 'Invalid credentials'};
            }
            let errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg);
            return Observable.throw(errMsg);
        });
    }

    /*constructor(private http: $http, $q, USER_ROLES, Session, AccessLevel, $log, $location) {


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

    }*/
}

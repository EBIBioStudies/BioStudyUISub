import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import {Location} from '@angular/common';

import {Credentials} from './credentials';
import {RegistrationData} from './registration-data';

import {AuthEvents} from './auth-events';
import {UserSession} from '../session/user-session';
import {UserRole} from '../session/user-role';

@Injectable()
export class AuthService {

    constructor(@Inject(HttpClient) private http: HttpClient,
                @Inject(AuthEvents) private  authEvents: AuthEvents,
                @Inject(UserSession) private userSession: UserSession,
                @Inject(Location) private location: Location) {
    }

    isAuthenticated() {
        return !this.userSession.isAnonymous();
    }

    currentUser() {
        return this.userSession.user;
    }

    activate(key: string): Observable<any> {
        return this.http.post('/raw/auth/activate/' + key, {})
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    passwordResetRequest(email: string, recaptcha: string): Observable<any> {
        let loc = window.location;
        let path = loc.origin + loc.pathname + "#/password_reset";
        return this.http.post("/api/auth/passrstreq/", {email: email, path: path, 'recaptcha2-response': recaptcha})
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    passwordReset(key, password, recaptcha) {
        return this.http.post("/raw/auth/passreset/", {
            key: key,
            password: password,
            'recaptcha2-response': recaptcha
        })
            .map(
                (res: Response) => {
                    let data = res.json();
                    if (data.status === 'OK') {
                        return data;
                    }
                    return Observable.throw({status: 'Error', message: data.message || 'Server error'});
                })
            .catch((error)=> {
                if (error.status === 400) { //invalid request
                    return error.json();
                }
                return AuthService.errorHandler(error);
            });
    }

    signIn(credentials: Credentials): Observable<any> {
        return this.http.post('/raw/auth/signin', credentials.stringify())
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    var orcid = data.aux ? data.aux.orcid : '';
                    this.userSession.create(data.sessid, data.username, data.email, orcid, UserRole.User);
                    this.authEvents.userSignedIn(data.username);
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    signUp(regData: RegistrationData): Observable<any> {
        //TODO
        return Observable.just({});
    }

    signOut(): Observable<any> {
        if (!this.isAuthenticated()) {
            return Observable.just({});
        }

        return this.http.post("/api/auth/signout", {})
            .map(
                () => {
                    this.sessionDestroy();
                    return {};
                })
            .catch((error) => {
                if (error.status === 403) { //session expired
                    this.sessionDestroy();
                } else {
                    AuthService.errorHandler(error);
                }
            });
    }

    private sessionDestroy() {
        let userName = this.userSession.user.name;
        this.userSession.destroy();
        this.authEvents.userSignedOut(userName);
    }

    static errorHandler(error: any) {
        let err = {status: '', message: ''};
        try {
            var jsonError = error.json ? error.json() : error;
            err.status = (jsonError.status) ? jsonError.status : 'Error';
            err.message = (jsonError.message) ? jsonError.message : 'Server error';
        } catch (e) {
            // probably not a json
            err.status = error.status || 'Error';
            err.message = error.statusText || 'Server error';
        }
        console.error(err);
        return Observable.throw(err);
    }


    /*constructor(private http: $http, $q, USER_ROLES, Session, AccessLevel, $log, $location) {



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

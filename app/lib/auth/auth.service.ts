import {Injectable, Inject} from '@angular/core';
import {Location} from '@angular/common';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';


import {RegistrationData} from './registration-data';

import {UserSession} from './user-session';

import {HttpClient} from '../http/index'

@Injectable()
export class AuthService {

    constructor(@Inject(HttpClient) private http: HttpClient,
                @Inject(UserSession) private userSession: UserSession) {
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
        let path = this.getFullPath('#/password_reset');
        return this.http.post('/api/auth/passrstreq/', {email: email, path: path, 'recaptcha2-response': recaptcha})
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    passwordReset(key, password, recaptcha): Observable<any> {
        return this.http.post('/raw/auth/passreset/', {
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
            .catch((error) => {
                if (error.status === 400) { //invalid request
                    return Observable.throw(error.json());
                }
                return AuthService.errorHandler(error);
            });
    }

    resendActivationLink(email, recaptcha): Observable<any> {
        let path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/resendActLink/', {
            email: email,
            path: path,
            'recaptcha2-response': recaptcha
        })
            .map((resp: Response) => {
                let data = resp.json();
                if (data.status === 'OK') {
                    return resp.json();
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch((error) => {
                if (error.status === 403) {
                    return Observable.throw(error.json());
                }
                return AuthService.errorHandler(error);
            });
    }

    checkUser(): Observable<any> {
        return this.http.get('/raw/auth/check?format=json')
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    signIn(login, password): Observable<any> {
        return this.http.post('/raw/auth/signin', {login: login, password: password})
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    this.userSession.create(login, data.sessid);
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    signUp(regData: RegistrationData): Observable<any> {
        let user = RegistrationData.transform(regData);
        user.path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/signup', user)
            .map((resp: Response) => {
                let data = resp.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch((error) => {
                if (error.status === 403 || error.status === 400) {
                    return Observable.throw(error.json());
                }
                return AuthService.errorHandler(error);
            });
    }

    signOut(): Observable<any> {
        if (this.userSession.isAnonymous()) {
            return Observable.just({});
        }
        return this.http.post("/api/auth/signout", {})
            .map(() => {
                    this.sessionDestroy();
                    return {};
                })
            .catch((error) => {
                if (error.status === 403) { //session expired
                    this.sessionDestroy();
                    return Observable.throw({});
                }
                return AuthService.errorHandler(error);
            });
    }

    private getFullPath(ancor: string = '') {
        let loc = window.location;
        console.log(loc, loc.pathname);
        return loc.origin + loc.pathname + ancor;
    }

    private sessionDestroy() {
        this.userSession.destroy();
    }

    static errorHandler(error: any) {
        let err = {
            status: error.status || 'Error',
            message: error.statusText || 'Server error'
        };
        if (error.json) {
            try {
                let jsonError = error.json();
                err.message = jsonError.message || err.message;
            } catch(e) {// ignore ?
                console.log(error);
            }
        }
        console.error(err);
        return Observable.throw(err);
    }

}

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

    signIn(login, password): Observable<any> {
        return this.http.post('/raw/auth/signin', {login: login, password: password})
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    this.userSession.create(data.sessid);
                    return data;
                }
                return Observable.throw({status: 422, statusText: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }

    checkUser(): Observable<any> {
        return this.http.get('/raw/auth/check?format=json')
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 422, statusText: data.message || 'Server error'});
            })
            .catch(AuthService.errorHandler);
    }


    passwordResetRequest(email: string, recaptcha: string): Observable<any> {
        let path = this.getFullPath('#/password_reset');
        return this.http.post('/api/auth/password/reset_request', {email: email, path: path, 'captcha': recaptcha})
            .map((res: Response) => res.json())
            .catch(AuthService.errorHandler);
    }

    passwordReset(key: string, password: string, recaptcha: string): Observable<any> {
        return this.http.post('/api/auth/password/reset', {key: key, password: password, 'captcha': recaptcha})
            .map((res: Response) => res.json())
            .catch(AuthService.errorHandler);
    }

    resendActivationLink(email: string, recaptcha: string): Observable<any> {
        let path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/activation/link', {email: email, path: path, 'captcha': recaptcha})
            .map((resp: Response) => resp.json())
            .catch(AuthService.errorHandler);
    }

    activate(key: string): Observable<any> {
        return this.http.post('/api/auth/activation/check/' + key, {})
            .map((res: Response) => res.json())
            .catch(AuthService.errorHandler);
    }

    signUp(regData: RegistrationData): Observable<any> {
        regData.path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/signup', regData)
            .map((resp: Response) => resp.json())
            .catch(AuthService.errorHandler);
    }

    signOut(): Observable<any> {
        if (this.userSession.isAnonymous()) {
            return Observable.of({});
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
            } catch (e) {// ignore ?
                console.log(error);
            }
        }
        console.error(err);
        return Observable.throw(err);
    }

}

import {Injectable, Optional} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import {RegistrationData} from './registration-data';
import {UserSession} from './user-session';
import {AuthModuleConfig} from './auth.module.config';
import {HttpClient} from '../http/index'

@Injectable()
export class AuthService {

    private __errorHandler =
        (error: any) => {
           console.log(error);
           return Observable.throw(error);
        };

    constructor(private http: HttpClient,
                private userSession: UserSession,
                @Optional() authConfig: AuthModuleConfig) {
        if (authConfig) {
            this.__errorHandler = authConfig.httpErrorHandler;
        }
    }

    signIn(login, password): Observable<any> {
        return this.http.post('/raw/auth/signin', {login: login, password: password})
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    this.userSession.create(data.sessid);
                    return data;
                }
                return Observable.throw({status: 422, statusText: 'ClientError', data: data});
            })
            .catch(this.__errorHandler);
    }

    checkUser(): Observable<any> {
        return this.http.get('/raw/auth/check?format=json')
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw({status: 422, statusText: 'ClientError', data: data});
            })
            .catch(this.__errorHandler);
    }

    passwordResetRequest(email: string, recaptcha: string): Observable<any> {
        let path = this.getFullPath('#/password_reset');
        return this.http.post('/api/auth/password/reset_request', {email: email, path: path, 'captcha': recaptcha})
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    passwordReset(key: string, password: string, recaptcha: string): Observable<any> {
        return this.http.post('/api/auth/password/reset', {key: key, password: password, 'captcha': recaptcha})
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    resendActivationLink(email: string, recaptcha: string): Observable<any> {
        let path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/activation/link', {email: email, path: path, 'captcha': recaptcha})
            .map((resp: Response) => resp.json())
            .catch(this.__errorHandler);
    }

    activate(key: string): Observable<any> {
        return this.http.post('/api/auth/activation/check/' + key, {})
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    signUp(regData: RegistrationData): Observable<any> {
        regData.path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/signup', regData)
            .map((resp: Response) => resp.json())
            .catch(this.__errorHandler);
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
                if (error.status === 403) { //wtf!! session expired
                    this.sessionDestroy();
                    return Observable.throw({});
                }
                return this.__errorHandler(error);
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
}

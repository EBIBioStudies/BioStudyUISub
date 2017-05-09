import {Injectable, Optional} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import {RegistrationData} from './registration-data';
import {UserSession} from './user-session';
import {HttpClient, ServerError} from '../http/index'

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private userSession: UserSession) {
    }

    signIn(obj: {login: string, password: string}): Observable<any> {
        return this.http.post('/raw/auth/signin', obj)
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    this.userSession.create(data.sessid);
                    return data;
                }
                return Observable.throw(new ServerError(422, 'ClientError', data));
            });
    }

    checkUser(): Observable<any> {
        return this.http.get('/raw/auth/check?format=json')
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw(new ServerError(422, 'ClientError', data));
            });
    }

    passwordResetRequest(email: string, recaptcha: string): Observable<any> {
        let path = this.getFullPath('#/password_reset');
        return this.http.post('/api/auth/password/reset_request', {email: email, path: path, 'captcha': recaptcha})
            .map((res: Response) => res.json());
    }

    passwordReset(key: string, password: string, recaptcha: string): Observable<any> {
        return this.http.post('/api/auth/password/reset', {key: key, password: password, 'captcha': recaptcha})
            .map((res: Response) => res.json());
    }

    resendActivationLink(email: string, recaptcha: string): Observable<any> {
        let path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/activation/link', {email: email, path: path, 'captcha': recaptcha})
            .map((resp: Response) => resp.json());
    }

    activate(key: string): Observable<any> {
        return this.http.post('/api/auth/activation/check/' + key, {})
            .map((res: Response) => res.json());
    }

    signUp(regData: RegistrationData): Observable<any> {
        regData.path = this.getFullPath('#/activate');
        return this.http.post('/api/auth/signup', regData)
            .map((resp: Response) => resp.json());
    }

    signOut(): Observable<any> {
        if (this.userSession.isAnonymous()) {
            return Observable.of({});
        }
        return this.http.post("/api/auth/signout", {})
            .map(() => {
                this.sessionDestroy();
                return {};
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

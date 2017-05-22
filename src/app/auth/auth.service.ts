import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import {
    HttpClient,
    ServerError
} from 'app/http/index'

import {RegistrationData} from './model/registration-data';
import {PasswordResetData} from './model/password-reset-data';
import {
    ActivationLinkRequestData,
    PasswordResetRequestData
} from './model/email-req-data';

import {UserSession} from './user-session';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private userSession: UserSession) {
    }

    signIn(obj: { login: string, password: string }): Observable<any> {
        return this.http.post('/raw/auth/signin', obj)
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    this.userSession.create(data.sessid);
                    return data;
                }
                return Observable.throw(ServerError.dataError(data));
            });
    }

    checkUser(): Observable<any> {
        return this.http.get('/raw/auth/check?format=json')
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    return data;
                }
                return Observable.throw(ServerError.dataError(data));
            });
    }

    passwordResetReq(obj: PasswordResetRequestData): Observable<any> {
        return this.http.post('/api/auth/password/reset_request', obj.snapshot())
            .map((res: Response) => res.json());
    }

    passwordReset(obj: PasswordResetData): Observable<any> {
        return this.http.post('/api/auth/password/reset', obj.snapshot())
            .map((res: Response) => res.json());
    }

    activationLinkReq(obj: ActivationLinkRequestData): Observable<any> {
        return this.http.post('/api/auth/activation/link', obj.snapshot())
            .map((resp: Response) => resp.json());
    }

    activate(key: string): Observable<any> {
        return this.http.post('/api/auth/activation/check/' + key, {})
            .map((res: Response) => res.json());
    }

    signUp(regData: RegistrationData): Observable<any> {
        return this.http.post('/api/auth/signup', regData.snapshot())
            .map((resp: Response) => resp.json());
    }

    signOut(): Observable<any> {
        if (this.userSession.isAnonymous()) {
            return Observable.of({});
        }
        return this.http.post("/api/auth/signout", {})
            .map(() => {
                this.userSession.destroy();
                return {};
            });
    }
}

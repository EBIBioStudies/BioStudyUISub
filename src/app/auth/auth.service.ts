import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import {
    HttpCustomClient,
    ServerError
} from 'app/http/index'

import {RegistrationData} from './model/registration-data';
import {PasswordResetData} from './model/password-reset-data';
import {
    ActivationLinkRequestData,
    PasswordResetRequestData
} from './model/email-req-data';

import {UserSession} from './user-session';
import {throwError} from "rxjs/index";

@Injectable()
export class AuthService {

    constructor(private http: HttpCustomClient,
                private userSession: UserSession) {
    }

    signIn(obj: { login: string, password: string }): Observable<any> {
        return this.http.post('/raw/auth/signin', obj).map((response) => {
            if (response.status === 'OK') {
                this.userSession.create(response.sessid);
                return response;
            }
            return throwError(ServerError.dataError(response));
        });
    }

    checkUser(): Observable<any> {
        return this.http.get('/raw/auth/check?format=json').map((response) => {
            if (response.status === 'OK') {
                return response;
            }
            return throwError(ServerError.dataError(response));
        });
    }

    passwordResetReq(obj: PasswordResetRequestData): Observable<any> {
        return this.http.post('/api/auth/password/reset_request', obj.snapshot());
    }

    passwordReset(obj: PasswordResetData): Observable<any> {
        return this.http.post('/api/auth/password/reset', obj.snapshot());
    }

    activationLinkReq(obj: ActivationLinkRequestData): Observable<any> {
        return this.http.post('/api/auth/activation/link', obj.snapshot());
    }

    activate(key: string): Observable<any> {
        return this.http.post('/api/auth/activation/check/' + key, {});
    }

    signUp(regData: RegistrationData): Observable<any> {
        return this.http.post('/api/auth/signup', regData.snapshot());
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

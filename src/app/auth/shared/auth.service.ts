import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    RegistrationData,
    PasswordResetData,
    ActivationLinkRequestData,
    PasswordResetRequestData,
    UserInfo
} from 'app/auth/model';

import {ServerError} from 'app/http'

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {UserSession} from './user-session';

interface StatusResponse {
    status: string // 'OK' or 'FAIL'
}

interface UserInfoResponse extends UserInfo, StatusResponse {
}

interface SignUpResponse extends StatusResponse {
    message: string
}

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private userSession: UserSession) {
    }

    signIn(obj: { login: string, password: string }): Observable<UserInfo> {
        return this.http.post<UserInfoResponse>('/raw/auth/signin', obj).pipe(
            map(resp => AuthService.statusCheck(resp)),
            map(resp => {
                this.userSession.create(resp.sessid);
                return resp;
            }));
    }

    checkUser(): Observable<UserInfo> {
        return this.http.get<UserInfoResponse>('/raw/auth/check?format=json').pipe(
            map(resp => AuthService.statusCheck(resp)));
    }

    passwordResetReq(obj: PasswordResetRequestData): Observable<StatusResponse> {
        return this.http.post<StatusResponse>('/api/auth/password/reset_request', obj.snapshot()).pipe(
            map(resp => AuthService.statusCheck(resp)));
    }

    passwordReset(obj: PasswordResetData): Observable<any> {
        return this.http.post('/api/auth/password/reset', obj.snapshot());
    }

    activationLinkReq(obj: ActivationLinkRequestData): Observable<any> {
        return this.http.post('/api/auth/activation/link', obj.snapshot());
    }

    activate(key: string): Observable<any> {
        return this.http.post(`/api/auth/activation/check/${key}`, {});
    }

    signUp(regData: RegistrationData): Observable<SignUpResponse> {
        return this.http.post<SignUpResponse>('/api/auth/signup', regData.snapshot()).pipe(
            map(resp => AuthService.statusCheck(resp)));
    }

    signOut(): Observable<any> {
        if (this.userSession.isAnonymous()) {
            return of({});
        }
        return this.http.post('/api/auth/signout', {})
            .map(() => {
                this.userSession.destroy();
                return {};
            });
    }

    private static statusCheck<T extends StatusResponse>(resp: T): T {
        if (resp.status === 'OK') {
            return resp;
        }
        throw ServerError.dataError(resp);
    }
}

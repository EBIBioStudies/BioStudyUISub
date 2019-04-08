import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ServerError} from 'app/http'

import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {AppConfig} from '../../app.config';
import {
    UserInfo,
    PasswordResetRequestData,
    PasswordResetData,
    ActivationLinkRequestData,
    RegistrationData, copyAndExtend
} from './model';

import {UserSession} from './user-session';

interface StatusResponse {
    status: string, // 'OK' or 'FAIL'
    message?: string
}

interface UserInfoResponse extends UserInfo, StatusResponse {
}

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private userSession: UserSession,
                private appConfig: AppConfig) {
    }

    signIn(obj: { login: string, password: string }): Observable<UserInfo> {
        return this.http.post<UserInfoResponse>('/raw/auth/signin', obj).pipe(
            catchError(resp => AuthService.catch403Error<UserInfoResponse>(resp)),
            map(resp => AuthService.statusCheck(resp)),
            map(resp => {
                this.userSession.create(resp);
                return resp;
            }));
    }

    checkUser(): Observable<UserInfo> {
        return this.http.get<UserInfoResponse>('/raw/auth/check?format=json').pipe(
            map(resp => {
                const value = AuthService.statusCheck(resp);
                this.userSession.update(resp);
                return value;
            }));
    }

    passwordResetReq(obj: PasswordResetRequestData): Observable<StatusResponse> {
        return this.http.post<StatusResponse>('/raw/auth/passrstreq', this.withInstanceKey(obj.snapshot())).pipe(
            map(resp => AuthService.statusCheck(resp)));
    }

    passwordReset(obj: PasswordResetData): Observable<StatusResponse> {
        return this.http.post<StatusResponse>('/raw/auth/passreset', obj.snapshot());
    }

    activationLinkReq(obj: ActivationLinkRequestData): Observable<StatusResponse> {
        return this.http.post<StatusResponse>('/raw/auth/retryact', this.withInstanceKey(obj.snapshot()));
    }

    activate(key: string): Observable<StatusResponse> {
        return this.http.post<StatusResponse>(`/raw/auth/activate/${key}`, {});
    }

    signUp(regData: RegistrationData): Observable<StatusResponse> {
        return this.http.post<StatusResponse>('/raw/auth/signup', this.withInstanceKey(regData.snapshot())).pipe(
            catchError(resp => AuthService.catch403Error<StatusResponse>(resp)),
            map(resp => AuthService.statusCheck(resp)));
    }

    signOut(): Observable<StatusResponse> {
        if (this.userSession.isAnonymous()) {
            return of({
                status: 'OK'
            });
        }
        return this.http.post<StatusResponse>('/raw/auth/signout', {sessid: this.userSession.token()}).pipe(
            map(resp => AuthService.statusCheck(resp)),
            map(resp => {
                this.userSession.destroy();
                return resp;
            })
        );
    }

    private withInstanceKey(obj: { [key: string]: string }): { [key: string]: string } {
        return copyAndExtend(obj, {
            instanceKey: this.appConfig.instanceKey,
            path: this.appConfig.contextPath + '/' + obj.path
        });
    }

    private static statusCheck<T extends StatusResponse>(resp: T): T {
        if (resp.status === 'OK') {
            return resp;
        }
        throw ServerError.dataError(resp);
    }

    private static catch403Error<T>(resp: HttpErrorResponse): Observable<T> {
        if (resp.status === 403) return of(resp.error); // server should not return 403 status
        throw resp;
    }
}

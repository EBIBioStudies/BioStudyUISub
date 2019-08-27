import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerError } from 'app/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { UserSession } from './user-session';
import {
    UserInfo,
    PasswordResetRequestData,
    PasswordResetData,
    ActivationLinkRequestData,
    RegistrationData, copyAndExtend
} from './model';


interface StatusResponse {
    status: string, // 'OK' or 'FAIL'
    message?: string
}

interface UserInfoResponse extends UserInfo, StatusResponse {
}

@Injectable()
export class AuthService {
    private static statusCheck<T extends StatusResponse>(resp: T): T {
        if (resp.status === 'OK') {
            return resp;
        }
        throw ServerError.dataError(resp);
    }

    private static catch403Error<T>(resp: HttpErrorResponse): Observable<T> {
        if (resp.status === 403) {
            return of(resp.error); // server should not return 403 status
        }

        throw resp;
    }

    constructor(private http: HttpClient,
                private userSession: UserSession,
                private appConfig: AppConfig) {
    }

    private checkStatus<T>(response: HttpResponse<T>): UserInfo {
        if (response.status === 200) {
            return <UserInfo>(response.body || {});
        }

        throw ServerError.dataError(response.body);
    }

    signIn(obj: { login: string, password: string }): Observable<UserInfo> {
        return this.http.post<UserInfoResponse>(
            '/raw/auth/signin',
            obj,
            { observe: 'response' }
        ).pipe(
            catchError((response: HttpErrorResponse) => AuthService.catch403Error<UserInfoResponse>(response)),
            map((response: HttpResponse<UserInfoResponse>) => this.checkStatus<UserInfoResponse>(response)),
            map((user: UserInfo) => this.userSession.create(user))
        );
    }

    checkUser(): Observable<UserInfo> {
        return this.http.get<UserInfoResponse>(
            '/raw/auth/profile',
            { observe: 'response' }
        ).pipe(
            map((response: HttpResponse<UserInfoResponse>) => this.checkStatus(response)),
            map((user: UserInfo) => this.userSession.update(user))
        );
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
        return this.http.post<StatusResponse>(
            '/raw/auth/signup',
            this.withInstanceKey(regData.snapshot()),
            { observe: 'response' }
        ).pipe(
            catchError((response) => AuthService.catch403Error<StatusResponse>(response)),
            map((response: HttpResponse<StatusResponse>) => this.checkStatus(response)),
            map(() => ({ status: 'OK' }))
        );
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
}

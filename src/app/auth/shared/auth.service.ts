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

interface UserInfoResponse extends UserInfo, StatusResponse { }

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private userSession: UserSession,
    private appConfig: AppConfig
  ) { }

  signIn(user: { login: string, password: string }): Observable<UserInfo> {
    return this.sendPostRequest<UserInfoResponse, UserInfo>('/raw/auth/signin', user)
      .pipe(map((userInfo: UserInfo) => this.userSession.create(userInfo)));
  }

  checkUser(): Observable<UserInfo> {
    return this.http.get<UserInfoResponse>(
      '/raw/auth/profile',
      { observe: 'response' }
    ).pipe(
      catchError((response: HttpErrorResponse) => this.catchError<UserInfoResponse>(response)),
      map((response: HttpResponse<UserInfoResponse>) => this.checkStatus(response)),
      map((user: UserInfo) => this.userSession.update(user))
    );
  }

  passwordResetReq(obj: PasswordResetRequestData): Observable<StatusResponse> {
    return this.sendPostRequest<UserInfoResponse, StatusResponse>('/raw/auth/changePassword', this.withInstanceKey(obj.snapshot()))
      .pipe(() => of({ status: 'OK' }));
  }

  passwordReset(obj: PasswordResetData): Observable<StatusResponse> {
    return this.http.post<StatusResponse>('/raw/auth/passreset', obj.snapshot());
  }

  activationLinkReq(obj: ActivationLinkRequestData): Observable<StatusResponse> {
    return this.sendPostRequest<StatusResponse, StatusResponse>('/raw/auth/retryact', this.withInstanceKey(obj.snapshot()))
      .pipe(() => of({ status: 'OK' }));
  }

  activate(key: string): Observable<StatusResponse> {
    return this.http.post<StatusResponse>(`/raw/auth/activate/${key}`, {});
  }

  signUp(regData: RegistrationData): Observable<StatusResponse> {
    return this.sendPostRequest<StatusResponse, StatusResponse>('/raw/auth/signup', this.withInstanceKey(regData.snapshot()))
      .pipe(() => of({ status: 'OK' }));
  }

  signOut(): Observable<StatusResponse> {
    if (this.userSession.isAnonymous()) {
      return of({ status: 'OK' });
    }

    return this.sendPostRequest<StatusResponse, StatusResponse>('/raw/auth/signout', { sessid: this.userSession.token() })
      .pipe(
        map(() => {
          this.userSession.destroy();

          return { status: 'OK' };
        })
      );
  }

  private catchError<T>(resp: HttpErrorResponse): Observable<T> {
    if (resp.status === 403) {
      return of(resp.error); // server should not return 403 status
    }

    throw ServerError.fromResponse(resp);
  }

  private checkStatus<R, T>(response: HttpResponse<R>): T {
    if (response.status === 200) {
      return <T>(response.body || {});
    }

    throw ServerError.dataError(response.body);
  }

  private sendPostRequest<R, T>(path: string, payload: any): Observable<T> {
    return this.http.post<R>(
      path, payload, { observe: 'response' }
    ).pipe(
      catchError((response: HttpErrorResponse) => this.catchError<R>(response)),
      map((response: HttpResponse<R>) => this.checkStatus<R, T>(response))
    );
  }

  private withInstanceKey(obj: { [key: string]: string }): { [key: string]: string } {
    return copyAndExtend(obj, {
      instanceKey: this.appConfig.instanceKey,
      path: this.appConfig.contextPath + '/' + obj.path
    });
  }
}

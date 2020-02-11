import * as HttpStatus from 'http-status-codes';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerError } from 'app/shared/server-error.handler';
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
  message?: string;
  status: string; // 'OK' or 'FAIL'
}

interface UserInfoResponse extends UserInfo, StatusResponse { }

@Injectable()
export class AuthService {
  constructor(
  private http: HttpClient,
  private userSession: UserSession,
  private appConfig: AppConfig
  ) { }

  activate(key: string): Observable<StatusResponse> {
    return this.http.post<StatusResponse>(`/api/auth/activate/${key}`, {});
  }

  changePassword(obj: PasswordResetData): Observable<StatusResponse> {
    return this.http.post<StatusResponse>('/api/auth/password/change', obj.snapshot());
  }

  getUserProfile(): Observable<UserInfo> {
    return this.http.get<UserInfoResponse>(
      '/api/auth/profile',
      { observe: 'response' }
    ).pipe(
      catchError((response: HttpErrorResponse) => this.catchProfileError<UserInfoResponse>(response)),
      map((response: HttpResponse<UserInfoResponse>) => this.checkProfileStatus(response)),
      map((user: UserInfo) => this.userSession.update(user))
    );
  }

  login(user: { login: string, password: string }): Observable<UserInfo> {
    return this.sendPostRequest<UserInfoResponse, UserInfo>('/api/auth/login', user)
      .pipe(map((userInfo: UserInfo) => this.userSession.create(userInfo)));
  }

  logout(): Observable<StatusResponse> {
    if (this.userSession.isAnonymous()) {
      return of({ status: 'OK' });
    }

    return this.sendPostRequest<StatusResponse, StatusResponse>('/api/auth/logout', { sessid: this.userSession.token() })
      .pipe(
        map(() => {
          this.userSession.destroy();

          return { status: 'OK' };
        })
      );
  }

  register(regData: RegistrationData): Observable<StatusResponse> {
    return this.http.post<StatusResponse>('/api/auth/register', this.withInstanceKey(regData.snapshot()))
      .pipe(
        catchError((response: HttpErrorResponse) => this.catchError<StatusResponse>(response))
      );
  }

  sendActivationLinkRequest(obj: ActivationLinkRequestData): Observable<StatusResponse> {
    return this.sendPostRequest<StatusResponse, StatusResponse>('/api/auth/retryact', this.withInstanceKey(obj.snapshot()));
  }

  sendPasswordResetRequest(obj: PasswordResetRequestData): Observable<StatusResponse> {
    return this.sendPostRequest<UserInfoResponse, StatusResponse>('/api/auth/password/reset', this.withInstanceKey(obj.snapshot()));
  }

  private catchError<T>(resp: HttpErrorResponse): Observable<T> {
    throw ServerError.fromResponse(resp);
  }

  private catchProfileError<T>(response: HttpErrorResponse): Observable<T> {
    this.userSession.destroy();

    return of(response.error);
  }

  private checkProfileStatus<R, T>(response: HttpResponse<R>): T {
    if (response.status !== HttpStatus.OK) {
      this.userSession.destroy();
    }

    return <T>(response.body || {});
  }

  private checkStatus<R, T>(response: HttpResponse<R>): T {
    if (response.status === HttpStatus.OK) {
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

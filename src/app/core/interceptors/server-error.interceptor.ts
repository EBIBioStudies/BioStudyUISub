import { UNAUTHORIZED } from 'http-status-codes';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserSession } from 'app/auth/shared';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private userSession: UserSession) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === UNAUTHORIZED) {
          this.userSession.destroy();
        }

        return throwError(error);
      })
    );
  }
}

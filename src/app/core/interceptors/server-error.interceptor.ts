import { UNAUTHORIZED } from 'http-status-codes';
import { Injectable, NgZone } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { UserSession } from 'app/auth/shared';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private userSession: UserSession, private zone: NgZone) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === UNAUTHORIZED) {
          this.userSession.destroy();
        }

        return throwError(error);
      })
    );
  }
}

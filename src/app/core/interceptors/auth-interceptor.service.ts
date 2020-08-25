import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCookies } from 'app/auth/shared';
import { AppConfig } from 'app/app.config';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private appConfig: AppConfig,
    private userCookies: UserCookies
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/api')) {
      req = req.clone({
        headers: this.updateHeaders(req.headers),
        url: this.updateUrl(req.url)
      });
    }

    return next.handle(req);
  }

  private updateHeaders(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    const sessionId = this.userCookies.getLoginToken();

    return sessionId ? headers.set('X-Session-Token', sessionId) : headers;
  }

  private updateUrl(url: string): string {
    return this.appConfig.proxyBase + url;
  }
}

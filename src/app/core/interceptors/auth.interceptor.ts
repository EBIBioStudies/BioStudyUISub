import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getLoginToken } from 'app/auth/shared';
import { AppConfig } from 'app/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private appConfig: AppConfig
  ) { }

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
    const sessionId = getLoginToken(this.appConfig.environment);

    return sessionId ? headers.set('X-Session-Token', sessionId) : headers;
  }

  private updateUrl(url: string): string {
    return this.appConfig.proxyBase + url;
  }
}

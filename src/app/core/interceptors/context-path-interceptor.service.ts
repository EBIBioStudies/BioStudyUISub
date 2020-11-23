import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';

@Injectable()
export class ContextPathInterceptorService implements HttpInterceptor {
  private paths: string[] = ['/api', '/log', '/identifiers'];

  constructor(private appConfig: AppConfig) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.paths.some((path) => req.url.startsWith(path))) {
      const contextPath: string = this.appConfig.contextPath;

      req = req.clone({ url: `${contextPath}${req.url}` });
    }

    return next.handle(req);
  }
}

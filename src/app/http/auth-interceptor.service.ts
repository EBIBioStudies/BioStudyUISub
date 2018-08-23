import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getLoginToken} from '../auth/user-cookies';
import {AppConfig} from '../app.config';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private appConfig: AppConfig) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith('/raw/files')) {
            console.log('before: ', req.url);
            req = req.clone({
                headers: this.updateHeaders(req.headers),
                url: this.updateUrl(req.url)
            });
            console.log('after: ', req.url)
        }
        return next.handle(req);
    }

    private updateHeaders(headers: HttpHeaders): any {
        headers = headers || new HttpHeaders();
        let sessionId = getLoginToken();
        return sessionId ? headers.set('X-Session-Token', sessionId) : headers;
    }

    private updateUrl(url: string): string {
        return this.appConfig.proxy_base + url;
    }
}
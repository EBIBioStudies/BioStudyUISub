import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {AppConfig} from '../config/app.config';
import {getUserCookies} from '../cookies/user-cookies';

@Injectable()
export class HttpClient {
    private prefix: string = AppConfig.PROXY_BASE;

    constructor(@Inject(Http) private http: Http) {}

    get(url) {
        let options = new RequestOptions({headers: this.headers()});
        return this.http.get(this.transform(url), options);
    }

    post(url, data) {
        let options = new RequestOptions({headers: this.headers()});
        return this.http.post(this.transform(url), data, options);
    }

    del(url) {
        let options = new RequestOptions({headers: this.headers()});
        return this.http.delete(this.transform(url), options);
    }

    upload(url, files: File[]): Observable<any> {
        let input = new FormData();
        for (let fi of files) {
            input.append('file', fi);
        }
        return this.post(url, input);
    }

    private headers(): Headers {
        let headers = new Headers();
        let sessionId = getUserCookies().token;
        if (sessionId) {
            headers.append('X-Session-Token', sessionId);
        }
        return headers;
    }

    private transform(url: string) {
        if (url.startsWith('/api/') || url.startsWith('/raw/')) {
            return this.prefix + url;
        }
        return url;
    }
}
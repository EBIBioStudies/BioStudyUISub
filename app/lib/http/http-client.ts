import {Injectable, Inject} from '@angular/core';
import {Http, RequestOptions, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {AppConfig} from '../app.config';
import {getLoginToken} from '../auth/user-cookies';
import {UploadService} from './upload.service';

@Injectable()
export class HttpClient {
    private prefix: string;

    constructor(@Inject(Http) private http: Http,
                @Inject(UploadService) private uploadService: UploadService,
                @Inject(AppConfig) appConfig: AppConfig) {

        this.prefix = appConfig.proxy_base;
        console.log('proxy_base', this.prefix);
    }

    get(url, urlParams?: any[]) {
        let options = new RequestOptions({headers: this.headers()});
        if (urlParams) {
            let params: URLSearchParams = new URLSearchParams();
            urlParams.forEach(p => {
                params.set(p.name, p.value);
            });
            options.search = params;
        }
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

    upload(url, files: File[], path: string): Observable<any> {
        let input = new FormData();
        input.append('path', path);
        for (let fi of files) {
            input.append('file', fi);
        }
        return this.uploadService.post(this.transform(url), input, this.headers());
    }

    private headers(): Headers {
        let headers = new Headers();
        let sessionId = getLoginToken();
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
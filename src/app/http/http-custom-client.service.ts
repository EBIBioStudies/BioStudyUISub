import {Injectable} from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpParams
} from "@angular/common/http";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import {AppConfig} from 'app/app.config';
import {getLoginToken} from 'app/auth/user-cookies';

import {UploadService} from './upload.service';
import {serverErrorHandler} from './server-error.handler';

@Injectable()
export class HttpCustomClient {

    constructor(private http: HttpClient,
                private uploadService: UploadService,
                private appConfig: AppConfig) {
    }

    get(url, urlParams?: any[]) {
        let options = {
            headers: this.headers(),
            params: new HttpParams()
        };

        //For non-empty parameters, filters out any undefined values and set the client's HTTP parameters to the remainder
        if (urlParams) {
            urlParams.filter(p => {
                return p.value !== undefined;
            }).forEach(p => {
                options.params = options.params.set(p.name, p.value);
            });
        }

        return this.http
            .get(this.transform(url), options)
            .catch(serverErrorHandler);
    }

    post(url, data) {
        let options = {headers: this.headers()};

        return this.http
            .post(this.transform(url), data, options)
            .catch(serverErrorHandler);
    }

    del(url) {
        let options = {headers: this.headers()};

        return this.http
            .delete(this.transform(url), options)
            .catch(serverErrorHandler);
    }

    upload(url, files: File[], path: string): Observable<any> {
        let input = new FormData();
        input.append('path', path);
        for (let fi of files) {
            input.append('file', fi);
        }
        return this.uploadService.post(this.transform(url), input, this.headers());
    }

    private headers(): HttpHeaders {
        let headers = new HttpHeaders();
        let sessionId = getLoginToken();
        if (sessionId) {
            return headers.append('X-Session-Token', sessionId);
        } else {
            return headers;
        }
    }

    private transform(url: string) {
        if (url.startsWith('/api/') || url.startsWith('/raw/')) {
            return this.appConfig.proxy_base + url;
        }
        return url;
    }
}
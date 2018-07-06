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

    /**
     * Compiles multiple files into a FormData object and makes a POST request
     * @param url - URL the POST request is issued to.
     * @param {File[]} files - File objects as given by the browser's File API.
     * @param {string} path - Global path for all the uploads.
     * @returns {Observable<any>} Stream of asynchronous events for the POST request.
     */
    upload(url, files: File[], path: string): Observable<any> {
        let input = new FormData();
        let file;

        //Sets the entries for each of the files to be uploaded, ignoring the full path when sending the filename.
        //NOTE: When using a bulk folder, the "webkitRelativePath" prefixes the filename if the latter is not provided.
        input.append('path', path);
        for (file of files) {
            input.append('file', file, file.name);
        }

        //TODO: The error handler is only allowed within whatever routine calls the "upload" method. It should be brought back to this layer so that a "catch" can be used, just like with the other REST verb operations.
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
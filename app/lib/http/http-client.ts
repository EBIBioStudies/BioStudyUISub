import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class HttpClient {

    constructor(@Inject(Http) http: Http) {
        //TODO: use config
        this.prefix = '/proxy';
        this.http = http;
    }

    get(url) {
        return this.http.get(this.transform(url));
    }

    post(url, data) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.transform(url), data, options);
    }

    private transform(url: string) {
        if (url.startsWith('/api/') || url.startsWith('/raw/')) {
            return this.prefix + url;
        }
        return url;
    }
}
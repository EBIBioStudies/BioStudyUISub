import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {UserSession} from '../session/user-session';

@Injectable()
export class HttpClient {
    //TODO: use config
    private prefix:string = '/proxy';

    constructor(@Inject(Http) private http: Http,
                @Inject(UserSession) private userSession: UserSession
    ) {}

    get(url) {
        let headers = this.headers();
        let options =  new RequestOptions({headers: headers});
        return this.http.get(this.transform(url), options);
    }

    post(url, data) {
        let headers = this.headers();
        //headers.append('Content-Type', 'application/json');

        let options =  new RequestOptions({headers: headers});
        return this.http.post(this.transform(url), data, options);
    }

    upload(url, files: File[]): Observable<any> {
        let input = new FormData();
        for (let fi of files) {
            input.append('file', fi);
        }
        return this.post(url, input);
    }

    private headers() {
        let headers = new Headers();
        let sessionId = this.userSession.user.key;
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
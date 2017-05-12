import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppConfig {

    private config: any = {};

    constructor(private http: Http) {
    }

    get version(): string {
        return this.config.APP_VERSION;
    }

    get proxy_base(): string {
        return this.config.APP_PROXY_BASE;
    }

    get debug(): boolean {
        return this.config.APP_DEBUG_ENABLED;
    }

    get prod(): boolean {
        return this.config.APP_PROD;
    }

    // Promise is required here
    load(): Promise<any> {
        let req:Observable<any> = this.http.get('./config.json')
            .map(res => res.json());

        req.subscribe(res => {
                this.config = res;
                console.log('config', this.config);
            });

        return req.toPromise();
    }
}
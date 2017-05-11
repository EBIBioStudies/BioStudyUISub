import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppConfig {

    private __config: any = {};

    constructor(private http: Http) {
    }

    get version(): string {
        return this.__config.APP_VERSION;
    }

    get proxy_base(): string {
        return this.__config.APP_PROXY_BASE;
    }

    get debug(): boolean {
        return this.__config.APP_DEBUG_ENABLED;
    }

    get prod(): boolean {
        return this.__config.APP_PROD;
    }

    // Promise is required here
    load(): Promise<any> {
        let req:Observable<any> = this.http.get('./config.json')
            .map(res => res.json());

        req.subscribe(res => {
                this.__config = res;
                console.log('config', this.__config);
            });

        return req.toPromise();
    }
}
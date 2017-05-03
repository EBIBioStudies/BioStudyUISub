import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class AppConfig {

    private __config: any = {};

    constructor(private http: Http) {
        this.http.get('config.json')
            .subscribe(res => this.__config = res.json());
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
}
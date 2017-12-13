import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppConfig {

    private config: any = {};

    constructor(private http: HttpClient) {
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

    /**
     * Synonym getter providing the threshold below which the current screen size will trigger
     * tablet/mobile-geared layout.
     * @returns {number} Upper-limit screen size in pixels for tablet-like devices.
     */
    get tabletBreak(): number {
        return this.config.APP_TABLET_BREAKPOINT;
    }

    /**
     * Synonym getter providing the format in which dates should be displayed when listing submissions.
     * @returns {string} Format expressed in Angular's date pipe notation.
     * @see {@link https://angular.io/api/common/DatePipe}
     */
    get dateListFormat(): string {
        return this.config.APP_DATE_LIST_FORMAT;
    }

    /**
     * Synonym getter providing the format in which dates should be displayed when editing submissions.
     * @returns {string} Format following the Moment.js' notation.
     * @see {@link https://momentjs.com/docs/#/parsing/string-format/}
     */
    get dateInputFormat(): string {
        return this.config.APP_DATE_INPUT_FORMAT;
    }

    /**
     * Synonym getter providing a flag indicating whether past date selection is allowed.
     * @returns {boolean} Flag for past date allowance.
     */
    get canUsePastDates(): boolean {
        return this.config.APP_CAN_PAST_DATES;
    }

    //Promise is required here
    load(): Promise<any> {
        let req: Observable<any> = this.http.get('./config.json');

        req.subscribe(res => {
                this.config = res;
                console.log('config', this.config);
            });

        return req.toPromise();
    }
}
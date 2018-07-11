import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
    get allowPast(): boolean {
        return this.config.APP_ALLOW_PAST_DATES;
    }

    /**
     * Synonym getter providing the number of years ahead of the current date that the date picker will render
     * selectable dates of.
     * @returns {number} Maximum number of years into the future.
     */
    get maxDateYears(): number {
        return this.config.APP_MAX_DATE_YEARS;
    }

    /**
     * Synonym getter providing the maximum number of suggested entries in a typeahead box.
     * @returns {number} Maximum length of the suggestion list.
     */
    get maxSuggestLength(): number {
        return this.config.APP_MAX_SUGGEST_LENGTH;
    }

    /**
     * Synonym getter providing the URL for the script containing the GDPR banner's logic.
     * @returns {string} URL.
     */
    get bannerUrl(): string {
        return this.config.GDPR_BANNER_URL;
    }

    /**
     * Maximum number of concurrent connections supported by the browser. It should be in accordance to
     * a ball-park average for different browsers.
     * @see {@link http://www.browserscope.org/?category=network&v=top}
     * @returns {number} Number of allowed concurrent connections.
     */
    get maxConcurrent(): number {
        return this.config.MAX_CONCURRENT;
    }

    /**
     * Uses promises exclusively to fetch the JSON file specifying the app's configuration options.
     * NOTE: URL data may be included in those options. To ensure that correct URLs are generated, this
     * method has to be called before anything else, during app initialisation. Angular provides a mechanism
     * for that through the "APP_INITIALIZER" injector token. However, this feature is still experimental in v4,
     * requiring strict use of promises for it to be dependable.
     * @returns {Promise<any>} Promise fulfilled once the config data has been fetched.
     * @see {@link /src/app/app.module.ts}
     * @see {@link https://stackoverflow.com/a/40222544}
     */
    load(): Promise<any> {
        const whenFetched: Promise<any> = this.http.get('./config.json').toPromise();

        whenFetched.then(res => {
            this.config = res;
            console.log('config', this.config);
        });

        return whenFetched;
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  private config: any = {};

  constructor(private http: HttpClient) {}

  get proxyBase(): string {
    return this.config.APP_PROXY_BASE;
  }

  get instanceKey(): string {
    return this.config.APP_INSTANCE_KEY;
  }

  get contextPath(): string {
    return this.config.APP_CONTEXT;
  }

  get frontendURL(): string {
    return this.config.FRONTEND_URL;
  }

  /**
   * Synonym getter providing the threshold below which the current screen size will trigger
   * tablet/mobile-geared layout.
   * @returns Upper-limit screen size in pixels for tablet-like devices.
   */
  get tabletBreak(): number {
    return this.config.APP_TABLET_BREAKPOINT;
  }

  /**
   * Synonym getter providing the format in which dates should be displayed when listing submissions.
   * @returns Format expressed in Angular's date pipe notation.
   * @see {@link https://angular.io/api/common/DatePipe}
   */
  get dateListFormat(): string {
    return this.config.APP_DATE_LIST_FORMAT;
  }

  /**
   * Synonym getter providing the format in which dates should be displayed when editing submissions.
   * @returns Format following the Moment.js' notation.
   * @see {@link https://momentjs.com/docs/#/parsing/string-format/}
   */
  get dateInputFormat(): string {
    return this.config.APP_DATE_INPUT_FORMAT;
  }

  /**
   * Synonym getter providing the number of years ahead of the current date that the date picker will render
   * selectable dates of.
   * @returns Maximum number of years into the future.
   */
  get maxDateYears(): number {
    return this.config.APP_MAX_DATE_YEARS;
  }

  /**
   * Synonym getter providing the maximum number of suggested entries in a typeahead box.
   * @returns Maximum length of the suggestion list.
   */
  get maxSuggestLength(): number {
    return this.config.APP_MAX_SUGGEST_LENGTH;
  }

  /**
   * Synonym getter providing the URL for the script containing the GDPR banner's logic.
   * @returns URL.
   */
  get bannerUrl(): string {
    return this.config.GDPR_BANNER_URL;
  }

  /**
   * Maximum number of concurrent connections supported by the browser. It should be in accordance to
   * a ball-park average for different browsers.
   * @see {@link http://www.browserscope.org/?category=network&v=top}
   * @returns Number of allowed concurrent connections.
   */
  get maxConcurrent(): number {
    return this.config.MAX_CONCURRENT;
  }

  /**
   * The current environment where tha application is running.
   * @returns Name of the current environment.
   */
  get environment(): string {
    return this.config.APP_ENV;
  }

  get recaptchaPublicKey(): string {
    return this.config.RECAPTCHA_PUBLIC_KEY || '6Lc8JN0UAAAAAN4yxc0Ms6qIZ3fml-EYuuD_cTKi';
  }

  /**
   * Main super user's username used by biostudies team. Only this user can impersonate other users in the app.
   * @returns Username of the main user
   */
  get superUserUsername(): string {
    return this.config.APP_SUPER_USER_USERNAME;
  }

  get announcementHeadline(): string {
    return this.config.APP_ANNOUNCEMENT_HEADLINE;
  }

  get announcementContent(): string {
    return this.config.APP_ANNOUNCEMENT_CONTENT;
  }

  /**
   * Type of alert the announcement will be display with. Valid options are 'success', 'danger', 'warning', 'info'.
   */
  get announcementPriority(): string {
    return this.config.APP_ANNOUNCEMENT_PRIORITY;
  }

  /**
   * Uses promises exclusively to fetch the JSON file specifying the app's configuration options.
   * NOTE: URL data may be included in those options. To ensure that correct URLs are generated, this
   * method has to be called before anything else, during app initialisation. Angular provides a mechanism
   * for that through the "APP_INITIALIZER" injector token. However, this feature is still experimental in v4,
   * requiring strict use of promises for it to be dependable.
   * TODO: Since Angular has been bumped up to v7, the much cleaner "APP_INITIALIZER" approach should be followed instead.
   * @returns Promise fulfilled once the config data has been fetched.
   * @see {@link /src/app/app.module.ts}
   * @see {@link https://stackoverflow.com/a/40222544}
   */
  load(): Promise<any> {
    const whenFetched: Promise<any> = this.http.get('./config.json').toPromise();

    whenFetched.then((res) => {
      this.config = res;
    });

    return whenFetched;
  }
}

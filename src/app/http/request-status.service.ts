import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';

/**
 * Global listener to HTTP requests. Reports the status of any request in progress by means of observables,
 * emitting a boolean true if pending requests exist.
 * Based on the ng-http-loader project: {@link https://github.com/mpalourdio/ng-http-loader}
 */
@Injectable()
export class RequestStatusService implements HttpInterceptor {
    private _whenStatusChanged: Subject<boolean> = new Subject<boolean>();
    private _filteredUrlPatterns: RegExp[] = [];
    private _pendingRequests = 0;

    get filteredUrlPatterns(): RegExp[] {
        return this._filteredUrlPatterns;
    }

    get pendingRequests(): number {
        return this._pendingRequests;
    }

    get whenStatusChanged(): Observable<boolean> {
        return this._whenStatusChanged.asObservable();
    }

    private shouldBypass(url: string): boolean {
        return this._filteredUrlPatterns.some(e => {
            return e.test(url);
        });
    }

    /**
     *
     * @param {HttpRequest<any>} req
     * @param {HttpHandler} next
     * @returns {Observable<HttpEvent<any>>}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const shouldBypass = this.shouldBypass(req.url);

        if (!shouldBypass) {
            this._pendingRequests++;

            if (1 === this._pendingRequests) {
                this._whenStatusChanged.next(true);
            }
        }

        return next.handle(req).map(event => {
            return event;
        }).catch(error => {
            return Observable.throw(error);
        }).finally(() => {
            if (!shouldBypass) {
                this._pendingRequests--;

                if (0 === this._pendingRequests) {
                    this._whenStatusChanged.next(false);
                }
            }
        });
    }
}

export function RequestStatusServiceFactory() {
    return new RequestStatusService();
}

export let RequestStatusServiceFactoryProvider = {
    provide: RequestStatusService,
    useFactory: RequestStatusServiceFactory
};
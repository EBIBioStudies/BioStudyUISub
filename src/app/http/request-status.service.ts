import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import { catchError, finalize } from 'rxjs/operators';


/**
 * Global listener to HTTP requests. Reports the status of any request in progress by means of observables,
 * emitting a boolean true if pending requests exist.
 * Based on the ng-http-loader project: {@link https://github.com/mpalourdio/ng-http-loader}
 */
@Injectable()
export class RequestStatusService implements HttpInterceptor {
    private _whenStatusChanged: Subject<boolean> = new Subject<boolean>();
    private _filteredUrlPatterns: RegExp[] = []; // URLs to exclude from request status tracking
    private _pendingRequests = 0; // counter for pending requests

    get filteredUrlPatterns(): RegExp[] {
        return this._filteredUrlPatterns;
    }

    get pendingRequests(): number {
        return this._pendingRequests;
    }

    get whenStatusChanged(): Observable<boolean> {
        return this._whenStatusChanged.asObservable();
    }

    /**
     * Flags those URLs to which requests should not be counted as pending
     * @param {string} url - URL for the request in question
     * @returns {boolean} True if the request is to be ignored.
     */
    private shouldBypass(url: string): boolean {
        return this._filteredUrlPatterns.some(e => {
            return e.test(url);
        });
    }

    /**
     * Keeps track of pending requests and emits a true when the request counter is 0.
     * @param {HttpRequest<any>} req - Object representing the request
     * @param {HttpHandler} next - Next interceptor in the chain, if applicable.
     * @returns {Observable<HttpEvent<any>>} Observable the request has been turned into
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const shouldBypass = this.shouldBypass(req.url);

        if (!shouldBypass) {
            this._pendingRequests++;

            if (1 === this._pendingRequests) {
                this._whenStatusChanged.next(true);
            }
        }

        return next.handle(req).pipe(
            catchError((error) => throwError(error)),
            finalize(() => {
                if (!shouldBypass) {
                    this._pendingRequests--;

                    if (0 === this._pendingRequests) {
                        this._whenStatusChanged.next(false);
                    }
                }
            }));
    }
}

export function RequestStatusServiceFactory() {
    return new RequestStatusService();
}

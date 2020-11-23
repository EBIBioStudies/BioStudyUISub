import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/**
 * Global listener to HTTP requests. Reports the status of any request in progress by means of observables,
 * emitting a boolean true if pending requests exist.
 * Based on the ng-http-loader project: {@link https://github.com/mpalourdio/ng-http-loader}
 */
@Injectable()
export class RequestStatusInterceptorService implements HttpInterceptor {
  filteredUrlPatterns: RegExp[] = []; // URLs to exclude from request status tracking
  pendingRequests = 0; // counter for pending requests
  private statusChanged: Subject<boolean> = new Subject<boolean>();

  get whenStatusChanged(): Observable<boolean> {
    return this.statusChanged.asObservable();
  }

  /**
   * Keeps track of pending requests and emits a true when the request counter is 0.
   * @param req - Object representing the request
   * @param next - Next interceptor in the chain, if applicable.
   * @returns Observable the request has been turned into
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldBypass = this.shouldBypass(req.url);

    if (!shouldBypass) {
      this.pendingRequests++;

      if (1 === this.pendingRequests) {
        this.statusChanged.next(true);
      }
    }

    return next.handle(req).pipe(
      catchError((error) => throwError(error)),
      finalize(() => {
        if (!shouldBypass) {
          this.pendingRequests--;

          if (0 === this.pendingRequests) {
            this.statusChanged.next(false);
          }
        }
      })
    );
  }

  /**
   * Flags those URLs to which requests should not be counted as pending
   * @param url - URL for the request in question
   * @returns True if the request is to be ignored.
   */
  private shouldBypass(url: string): boolean {
    return this.filteredUrlPatterns.some((e) => {
      return e.test(url);
    });
  }
}

export function RequestStatusServiceFactory(): RequestStatusInterceptorService {
  return new RequestStatusInterceptorService();
}

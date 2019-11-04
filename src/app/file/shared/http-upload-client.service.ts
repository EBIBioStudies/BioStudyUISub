import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, last, map } from 'rxjs/operators';

enum UploadEventType {
    PROGRESS,
    SUCCESS,
    ERROR,
    OTHER
}

export class UploadEvent {
    private static SUCCESS_EVENT = new UploadEvent(UploadEventType.SUCCESS);

    static progress(percentage: number): UploadEvent {
        return new UploadProgressEvent(percentage);
    }

    static error(message: any) {
        return new UploadErrorEvent(message);
    }

    static fromHttpEvent(event: HttpEvent<any>): UploadEvent {
        switch (event.type) {
            case HttpEventType.Sent:
                return UploadEvent.progress(0);

            case HttpEventType.UploadProgress:
                const percentDone = Math.round(100 * event.loaded / event.total!);
                return UploadEvent.progress(percentDone);

            case HttpEventType.Response:
                return UploadEvent.SUCCESS_EVENT;

            default:
                console.log(event);
                return new UploadEvent();
        }
    }

    constructor(private readonly type: UploadEventType = UploadEventType.OTHER) {
    }

    isProgress(): boolean {
        return this.type === UploadEventType.PROGRESS;
    }

    isError(): boolean {
        return this.type === UploadEventType.ERROR;
    }

    isSuccess(): boolean {
        return this.type === UploadEventType.SUCCESS;
    }
}

export class UploadProgressEvent extends UploadEvent {
    constructor(readonly percentage: number) {
        super(UploadEventType.PROGRESS);
    }
}

export class UploadErrorEvent extends UploadEvent {
    constructor(readonly message: string) {
        super(UploadEventType.ERROR);
    }
}

@Injectable()
export class HttpUploadClientService {
    constructor(private http: HttpClient) {
    }

    upload(url: string, formData: FormData): Observable<UploadEvent> {
        const req = new HttpRequest('POST', url, formData, {
            reportProgress: true
        });

        return this.http.request(req).pipe(
            map(event => UploadEvent.fromHttpEvent(event)),
            last(), // return last (completed) message to caller
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<UploadEvent> {
        let message;
        if (error.error instanceof ErrorEvent) {
            message = error.error.message;
        } else {
            message = `Server error [${error.status}]: ${error.error}`;
        }
        return throwError(UploadEvent.error(message));
    }
}

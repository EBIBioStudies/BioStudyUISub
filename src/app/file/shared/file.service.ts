import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpParams, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {PathInfo, UserGroup} from './file-rest.model';
import {catchError, last, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

enum UploadEventType {
    PROGRESS,
    SUCCESS,
    ERROR,
    OTHER
}

export class UploadEvent {
    constructor(private readonly type: UploadEventType) {
    }

    private static SUCCESS_EVENT = new UploadEvent(UploadEventType.SUCCESS);

    static progress(percentage: number): UploadEvent {
        return new UploadProgressEvent(percentage);
    }

    static success(): UploadEvent {
        return UploadEvent.SUCCESS_EVENT;
    }

    static error(message: any) {
        return new UploadErrorEvent(message);
    }

    static other(eventType: string) {
        return new UploadOtherEvent(eventType);
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
    constructor(public readonly percentage: number) {
        super(UploadEventType.PROGRESS);
    }
}

export class UploadErrorEvent extends UploadEvent {
    constructor(public readonly message: string) {
        super(UploadEventType.ERROR);
    }
}

export class UploadOtherEvent extends UploadEvent {
    constructor(public readonly eventType: string) {
        super(UploadEventType.OTHER);
    }
}

@Injectable()
export class FileService {
    constructor(private http: HttpClient) {
    }

    getUserDirs(groups?: Observable<UserGroup[]>): Observable<PathInfo[]> {
        return (groups || this.getUserGroups())
            .pipe(
                map(groups => groups.map(g => new PathInfo(g.name, '/Groups/' + g.name, 'DIR'))),
                map(paths => ([] as PathInfo[]).concat([new PathInfo('Home', '/User', 'DIR')], paths))
            )
    }

    getFiles(fullPath: string): Observable<PathInfo[]> {
        let params = new HttpParams().set('showArchives', 'true');
        return this.http.get<PathInfo[]>(`/raw/files${fullPath}`, {params});
    }

    removeFile(fullPath: string): Observable<any> {
        return this.http.delete(`/raw/files${fullPath}`);
    }

    getUserGroups(): Observable<UserGroup[]> {
        return this.http.get<UserGroup[]>('/raw/groups');
    }

    upload(fullPath: string, files: File[]): Observable<UploadEvent> {
        let formData = new FormData();

        files.forEach(file => {
            formData.append('files', file, file.name)
        });

        const req = new HttpRequest('POST', `/raw/files${fullPath}`, formData, {
            reportProgress: true
        });

        return this.http.request(req).pipe(
            map(event => this.toUploadEvent(event)),
            last(), // return last (completed) message to caller
            catchError(this.handleUploadError)
        );
    }

    private toUploadEvent(event: HttpEvent<any>): UploadEvent {
        switch (event.type) {
            case HttpEventType.Sent:
                return UploadEvent.progress(0);

            case HttpEventType.UploadProgress:
                const percentDone = Math.round(100 * event.loaded / event.total!);
                return UploadEvent.progress(percentDone);

            case HttpEventType.Response:
                return UploadEvent.success();

            default:
                return UploadEvent.other(event.type.toString());
        }
    }

    private handleUploadError(error: HttpErrorResponse): Observable<UploadEvent> {
        let message;
        if (error.error instanceof ErrorEvent) {
            message = error.error.message;
        } else {
            message = `Server error [${error.status}]: ${error.error}`;
        }
        return throwError(UploadEvent.error(message));
    }
}
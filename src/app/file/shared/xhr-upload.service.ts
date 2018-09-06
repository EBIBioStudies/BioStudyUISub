import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {HttpHeaders} from '@angular/common/http';

const isSuccess = (status: number): boolean => (status >= 200 && status < 300);

export class UploadResponse {
    constructor(private kind: string) {
    };

    isProgress(): boolean {
        return this.kind === 'progress'
    };

    isSuccess(): boolean {
        return this.kind === 'success'
    };

    isError(): boolean {
        return this.kind === 'error'
    };
}

export class UploadProgress extends UploadResponse {
    constructor(public progress: number) {
        super('progress');
    }
}

export class UploadSuccess extends UploadResponse {
    constructor(public status: number,
                public statusText: string,
                public body: any) {
        super('success');
    }
}

export class UploadError extends UploadResponse {
    constructor(public status: number,
                public statusText: string,
                public body: any) {
        super('error');
    }
}

@Injectable()
export class XhrUploadService {
    post(url: string, formData: FormData, headers?: HttpHeaders): Observable<UploadResponse> {
        return Observable.create((observer: Observer<UploadResponse>) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            const onProgress = (event) => {
                const progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                observer.next(new UploadProgress(progress));
            };

            const onError = (err: ErrorEvent) => {
                observer.error(new UploadError(
                    xhr.status,
                    xhr.statusText,
                    err
                ));
            };

            const onLoad = () => {
                let status: number = xhr.status === 1223 ? 204 : xhr.status;
                let body: any = null;
                if (status !== 204) {
                    body = (typeof xhr.response === 'undefined') ? xhr.responseText : xhr.response;
                }

                if (status === 0) {
                    status = body ? 200 : 0;
                }

                const statusText: string = xhr.statusText || 'OK';

                if (isSuccess(status)) {
                    observer.next(new UploadSuccess(
                        status,
                        statusText,
                        body
                    ));
                    observer.complete();
                    return;
                }
                observer.error(new UploadError(
                    status,
                    statusText,
                    body
                ));
            };

            xhr.open('post', url);

            if (headers === undefined) {
                headers = new HttpHeaders();
            }
            if (!headers.has('Accept')) {
                headers = headers.append('Accept', 'application/json, text/plain, */*');
            }
            headers.keys().forEach((key) => {
                xhr.setRequestHeader(key, headers!.getAll(key)!.join(','));
            });

            xhr.upload.addEventListener('progress', onProgress);
            xhr.addEventListener('load', onLoad);
            xhr.addEventListener('error', onError);

            xhr.send(formData);

            return () => {
                xhr.removeEventListener('load', onLoad);
                xhr.removeEventListener('error', onError);
                xhr.upload.removeEventListener('progress', onProgress);
                xhr.abort();
            };
        });
    }
}
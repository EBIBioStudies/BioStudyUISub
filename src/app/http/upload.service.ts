import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {HttpHeaders} from "@angular/common/http";

const isSuccess = (status: number): boolean => (status >= 200 && status < 300);

export class UploadProgress {
    public kind = "progress";

    constructor(public progress: number) {
    }
}
export class UploadResponse {
    public kind = "response";

    constructor(public status: number,
                public statusText: string,
                public type: string,
                public body: any) {
    }
}

type UploadResponseType = UploadProgress | UploadResponse;

@Injectable()
export class UploadService {
    post(url: string, formData: FormData, headers: HttpHeaders): Observable<UploadResponseType> {
        return Observable.create((observer: Observer<UploadResponseType>) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            const onProgress = (event) => {
                const progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                observer.next(new UploadProgress(progress));
            };

            const onError = (err: ErrorEvent) => {
                observer.error(new UploadResponse(
                    xhr.status,
                    xhr.statusText,
                    'Error',
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
                    observer.next(new UploadResponse(
                        status,
                        statusText,
                        'Success',
                        body
                    ));
                    observer.complete();
                    return;
                }
                observer.error(new UploadResponse(
                    status,
                    statusText,
                    'Error',
                    body
                ));
            };

            xhr.open('post', url);

            if (headers === null) {
                headers = new HttpHeaders();
            }
            if (!headers.has('Accept')) {
                headers = headers.append('Accept', 'application/json, text/plain, */*');
            }
            headers.keys().forEach((key) => {
                xhr.setRequestHeader(key, headers.getAll(key)!.join(','));
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
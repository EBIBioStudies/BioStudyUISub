import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxj/Subscription';

import * as _ from 'lodash';

const FILE_UPLOAD_URL = '/api/fileUpload';//'/raw/fileUpload'; // use '/api/fileUpload' in offline mode

export class FileUpload {
    private __status: string = 'uploading';
    private __error: string;
    private __sb: Subscription;
    private __progress: BehaviorSubject<number>;
    private __files: string[];
    private __path: string;

    constructor(path:string, files: File[], httpClient: HttpClient) {
        this.__path = path;
        this.__files = _.map(files, 'name');
        this.__progress = new BehaviorSubject(0);

        this.__sb = httpClient.upload(FILE_UPLOAD_URL, files, path)
            .subscribe(
                (res) => {
                    if (res.kind === 'progress') {
                        this.__progress.next(res.progress);
                    }
                    if (res.kind === 'response') {
                        this.__status = 'success';
                        this.__progress.complete();
                    }
                },
                err => {
                    //TODO error message
                    this.__status = 'error';
                    this.__error = 'file upload failed';
                    this.__progress.error('file upload failed');
                });
    }

    get path() : string {
        return this.__path;
    }

    get progress(): Observable<number> {
        return this.__progress;
    }

    get status(): string {
        return this.__status;
    }

    get files(): string[] {
        return _.map(this.__files, _.identity);
    }

    get error(): string {
        return this.__error;
    }

    cancel(): void {
        if (!this.finished()) {
            this.__sb.unsubscribe();
            this.__sb = null;
            this.__status = 'cancelled';
            this.__progress.complete();
        }
    }

    cancelled(): boolean {
        return this.__status === 'cancelled';
    }

    finished(): boolean {
        return this.done() || this.failed();
    }

    done(): boolean {
        return this.__status === 'success' || this.cancelled();
    }

    failed(): boolean {
        return this.__status === 'error';
    }
}

@Injectable()
export class FileUploadService {
    private __uploads: FileUpload[] = [];

    constructor(@Inject(HttpClient) private http: HttpClient) {
        console.debug("FileUploadService created");
    }

    activeUploads(): FileUpload[] {
        return _.filter(_.map(this.__uploads, _.identity), (u) => !u.done());
    }

    upload(path:string, files: File[]): FileUpload {
        let u = new FileUpload(path, files, this.http);
        this.__uploads.push(u);
        return u;
    }

    remove(u: FileUpload) {
        console.log(this.__uploads, u);
        _.pull(this.__uploads, [u]);
    }
}
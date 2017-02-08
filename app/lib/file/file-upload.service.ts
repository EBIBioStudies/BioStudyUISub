import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';
import {ProgressService} from '../http/progress.service';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxj/Subscription';

import * as _ from 'lodash';

const FILE_UPLOAD_URL = '/raw/fileUpload'; // use '/api/fileUpload' in offline mode

export class FileUpload {
    private __status: string = 'uploading';
    private __error: string;
    private __sb: Subscription;
    private __progress: BehaviorSubject;
    private __files: string[];

    constructor(path:string, files: File[], httpClient: HttpClient, progress: ProgressService): FileUpload {
        this.__files = _.map(files, 'name');
        this.__progress = new BehaviorSubject(0);

        let p = progress.uploadProgress.subscribe(
            e => {
                let p = Math.ceil(100 * (e.loaded / e.total));
                this.__progress.next(p);
            }
        );

        this.__sb = httpClient.upload(FILE_UPLOAD_URL, files, path)
            .subscribe(
                res => {
                    p.unsubscribe();
                    this.__status = 'success';
                    this.__progress.complete();
                },
                err => {
                    p.unsubscribe();
                    //TODO error message
                    this.__status = 'error';
                    this.__error = 'file upload failed';
                    this.__progress.error('file upload failed');
                });
    }

    get progress(): Observable {
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
            this.__progress.next(-2);
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

    constructor(@Inject(HttpClient) private http: HttpClient,
                @Inject(ProgressService) private progress: ProgressService) {
        console.debug("FileUploadService created");
    }

    currentUploads(): FileUpload[] {
        return _.map(this.__uploads, _.identity);
    }

    upload(path:string, files: File[]): FileUpload {
        let u = new FileUpload(path, files, this.http, this.progress);
        this.__uploads.push(u);
        return u;
    }

    remove(u: FileUpload) {
        console.log(this.__uploads, u);
        _.pull(this.__uploads, [u]);
    }
}
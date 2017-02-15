import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Path} from './path';

import * as _ from 'lodash';

const FILE_UPLOAD_URL = '/raw/fileUpload'; // use '/api/fileUpload' in offline mode

class FileUploadStatus {
    constructor(public status,
                public progress,
                public error) {
    }
}

export class FileUpload {
    private __status: string = 'uploading';
    private __error: string;
    private __sb: Subscription;
    private __progress: number;
    private __files: string[];
    private __path: Path;

    private __statusSubject: Subject<FileUploadStatus> = new Subject<FileUploadStatus>();

    finish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(path: Path, files: File[], httpClient: HttpClient) {
        this.__path = path;
        this.__files = _.map(files, 'name');
        this.__progress = 0;

        const failed = Observable.of(new FileUploadStatus('error', -1, 'file upload failed'));

        let upload = httpClient.upload(FILE_UPLOAD_URL, files, path.fullPath());

        let uploadStatus = upload
            .map((res) => {
                console.log(res);
                if (res.kind === 'progress') {
                    return new FileUploadStatus('uploading', res.progress, undefined);
                }
                if (res.kind === 'response') {
                    return new FileUploadStatus('success', 100, undefined);
                }
            })
            .catch((err) => {
                console.log(err);
                return failed;
            });


        this.__statusSubject.subscribe(
            (fus) => {
                console.log(fus);
                this.__progress = fus.progress;
                this.__status = fus.status;
                this.__error = fus.error;
                if (this.done()) {
                    this.finish$.next(true);
                    this.finish$.complete();
                }
            },
            console.log);

        this.__sb = uploadStatus.subscribe(this.__statusSubject);
    }

    get path(): Path {
        return this.__path;
    }

    get progress(): number {
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
            this.__statusSubject.next(new FileUploadStatus('cancelled', this.__progress, undefined));
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
    uploadFinish$: Subject<string> = new Subject<string>();

    constructor(@Inject(HttpClient) private http: HttpClient) {
    }

    activeUploads(): FileUpload[] {
        return _.filter(_.map(this.__uploads, _.identity), (u) => !u.done());
    }

    upload(path: Path, files: File[]): FileUpload {
        let u = new FileUpload(path, files, this.http);
        this.__uploads.push(u);
        u.finish$.filter(_.identity)
            .map(() => u.path.fullPath())
            .subscribe(this.uploadFinish$);
        return u;
    }

    remove(u: FileUpload) {
        console.log("remove upload", u, this.__uploads);
        _.pull(this.__uploads, u);
    }
}
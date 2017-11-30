import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {HttpCustomClient} from 'app/http/http-custom-client.service'
import {Path} from './path';

import * as _ from 'lodash';

const FILE_UPLOAD_URL = '/raw/fileUpload'; 

class FileUploadStatus {
    constructor(public status,
                public progress,
                public error) {
    }
}

export class FileUpload {
    private _status: string = 'uploading';
    private _error: string;
    private _sb: Subscription;
    private _progress: number;
    private _files: string[];
    private _path: Path;

    private _statusSubject: Subject<FileUploadStatus> = new Subject<FileUploadStatus>();

    finish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(path: Path, files: File[], httpClient: HttpCustomClient) {
        this._path = path;
        this._files = _.map(files, 'name');
        this._progress = 0;

        const failed = Observable.of(new FileUploadStatus('error', -1, 'file upload failed'));

        let upload = httpClient.upload(FILE_UPLOAD_URL, files, path.fullPath());

        let uploadStatus = upload
            .map((res) => {
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

        this._statusSubject.subscribe((fus) => {
                this._progress = fus.progress;
                this._status = fus.status;
                this._error = fus.error;
                if (this.done()) {
                    this.finish$.next(true);
                    this.finish$.complete();
                    this._statusSubject.complete();
                }
            }, console.log);

        this._sb = uploadStatus.subscribe(this._statusSubject);
    }

    get path(): Path {
        return this._path;
    }

    get progress(): number {
        return this._progress;
    }

    get status(): string {
        return this._status;
    }

    get files(): string[] {
        return _.map(this._files, _.identity);
    }

    get error(): string {
        return this._error;
    }

    cancel(): void {
        if (!this.finished()) {
            this._sb.unsubscribe();
            this._sb = null;
            this._statusSubject.next(new FileUploadStatus('cancelled', this._progress, undefined));
        }
    }

    cancelled(): boolean {
        return this._status === 'cancelled';
    }

    finished(): boolean {
        return this.done() || this.failed();
    }

    done(): boolean {
        return this._status === 'success' || this.cancelled();
    }

    failed(): boolean {
        return this._status === 'error';
    }
}

@Injectable()
export class FileUploadService {
    private _uploads: FileUpload[] = [];
    uploadFinish$: Subject<string> = new Subject<string>();

    constructor(private http: HttpCustomClient) {
    }

    activeUploads(): FileUpload[] {
        return _.filter(_.map(this._uploads, _.identity), (u) => !u.done());
    }

    upload(path: Path, files: File[]): FileUpload {
        let u = new FileUpload(path, files, this.http);
        this._uploads.push(u);
        u.finish$.filter(_.identity)
            .map(() => u.path.fullPath())
            .subscribe((path) => this.uploadFinish$.next(path)); // do not subscribe uploadFinish$ directly here.
        // as cancellation of finish$ will cancel uploadFinish$ as well
        return u;
    }

    remove(u: FileUpload) {
        _.pull(this._uploads, u);
    }
}
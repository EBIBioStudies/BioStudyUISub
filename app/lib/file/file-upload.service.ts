import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxj/Subscription';
import {Path} from './path';

import * as _ from 'lodash';

const FILE_UPLOAD_URL = '/raw/fileUpload'; // use '/api/fileUpload' in offline mode

export class FileUpload {
    private __status: string = 'uploading';
    private __error: string;
    private __sb: Subscription;
    private __progress: number;
    private __files: string[];
    private __path: Path;

    finish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(path: Path, files: File[], httpClient: HttpClient) {
        this.__path = path;
        this.__files = _.map(files, 'name');
        this.__progress = 0;

        this.__sb = httpClient.upload(FILE_UPLOAD_URL, files, path.fullPath())
            .subscribe(
                (res) => {
                    if (res.kind === 'progress') {
                        this.__progress = res.progress;
                    }
                    if (res.kind === 'response') {
                        this.__status = 'success';
                        this.__progress = 100;
                        this.complete();
                    }
                },
                (err) => {
                    //TODO error message
                    this.__status = 'error';
                    this.__error = 'file upload failed';
                    this.complete();
                });
    }

    private complete() {
        this.finish$.next(true);
        this.finish$.complete();
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
            this.__status = 'cancelled';
            this.complete();
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
    uploadFinish$: Subject<FileUpload> = new Subject<FileUpload>();

    constructor(@Inject(HttpClient) private http: HttpClient) {
    }

    activeUploads(): FileUpload[] {
        return _.filter(_.map(this.__uploads, _.identity), (u) => !u.done());
    }

    upload(path: Path, files: File[]): FileUpload {
        let u = new FileUpload(path, files, this.http);
        this.__uploads.push(u);
        u.finish$.subscribe((m) => {
            if (m) {
                this.uploadFinish$.next(u);
            }
        });
        return u;
    }

    remove(u: FileUpload) {
        _.pull(this.__uploads, [u]);
    }
}
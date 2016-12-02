import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';
import {ProgressService} from '../http/progress.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxj/Subscription';

import * as _ from 'lodash';

export class FileUpload {
    private __subj: Subject;
    private __status: string = 'uploading';
    private __sb: Subscription;
    private __error: string;
    private __progress: number;
    private __files: string[];

    constructor(files: File[], httpClient: HttpClient, progress: ProgressService): FileUpload {
        this.__files = _.map(files, 'name');
        this.__subj = new Subject();

        let p = progress.uploadProgress.subscribe(
            e => {
                let p = Math.ceil(100 * (e.loaded / e.total));
                this.__progress = p;
                this.__subj.next({progress: p});
            }
        );

        this.__sb = httpClient.upload('/api/fileUpload', files)
            .subscribe(res => {
                    p.unsubscribe();
                    this.__status = 'success';
                },
                err => {
                    p.unsubscribe();
                    this.__status = 'error';
                    //TODO error message
                    this.__error = 'an error';
                    this.__subj.next({error:'an error'});
                });
    }

    get progress(): Observable {
        return this.__subj;
    }

    get status(): string {
        return this.__status;
    }

    get files(): string[] {
        return _.map(this.__files, _.identity);
    }

    cancel(): void {
        if (!this.finished()) {
            this.__sb.unsubscribe();
            this.__sb = null;
            this.__status = 'cancelled';
        }
    }

    cancelled(): boolean {
        return this.__status === 'cancelled';
    }

    finished(): boolean {
        return this.done() || this.error();
    }

    done(): boolean {
        return this.__status === 'success';
    }

    error(): boolean {
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

    cancelAll() {
        //todo
    }

    upload(files: File[]): FileUpload {
        let u = new FileUpload(files, this.http, this.progress);
        this.__uploads.push(u);
        return u;
    }
}
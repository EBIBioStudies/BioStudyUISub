import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';


export class SubmUploadRequest {
    private __created: Date;
    private __filename: string;
    private __format: string;
    private __log: any;
    private __status: string = 'in_progress';

    constructor(filename: string, format: string) {
        this.__created = new Date();
        this.__filename = filename;
        this.__format = format || 'unspecified';
    }

    get failed(): boolean {
        return this.__status === 'error';
    }

    get successful(): boolean {
        return this.__status === 'success';
    }

    get inprogress(): boolean {
        return this.__status === 'in_progress';
    }

    get format(): string {
        return this.__format;
    }

    get created(): Date {
        return this.__created;
    }

    get filename(): string {
        return this.__filename;
    }

    get log(): any {
        return this.__log || {};
    }

    onResults(res: any): void {
        this.__log = res.log;
        this.__status = (res.status === 'FAIL') ? 'error' : 'success';
    }
}

@Injectable()
export class SubmissionUploadService {
    newUploadRequest$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>();

    constructor(@Inject(HttpClient) private http: HttpClient) {
    }

    upload(file: File, format: string): void {
        let formData = new FormData();
        formData.append('format', format);
        formData.append('file', file);

        let req = new SubmUploadRequest(file.name, format);
        this.http.post('/raw/formsubmit', formData)
            .subscribe(
                resp => {
                    req.onResults(resp.json());
                },
                error => {
                    req.onResults({
                        status: "FAIL",
                        log: {
                            "level": "ERROR",
                            "message": "request failed"
                        }
                    });
                });

        this.newUploadRequest$.next(req);
    }
}
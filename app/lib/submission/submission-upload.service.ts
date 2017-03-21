import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {SubmissionService} from './submission.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


export class SubmUploadRequest {
    private __created: Date;
    private __filename: string;
    private __format: string;
    private __log: any;
    private __status: string = 'in_progress';

    constructor(filename: string, format: string) {
        this.__created = new Date();
        this.__filename = filename;
        this.__format = format || '<auto-detect>';
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

    constructor(@Inject(SubmissionService) private submService: SubmissionService) {
    }

    upload(op: string, file: File, format: string): void {
        let req = new SubmUploadRequest(file.name, format);
        this.newUploadRequest$.next(req);

        this.submService.formSubmit(op, file, format)
            .subscribe(
                data => {
                    req.onResults(data);
                },
                error => {
                    const status = error.status || '';
                    const statusText = error.statusText || '';
                    const statusLine = (status ? status + ': ' : '') + (statusText ? statusText : '');
                    req.onResults({
                        status: "FAIL",
                        log: {
                            "level": "ERROR",
                            "message": "Submit request failed. " + statusLine
                        }
                    });
                });

    }
}
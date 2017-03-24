import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {SubmissionService} from './submission.service';

const enum ReqStatus {
    CONVERT = 'convert',
    SUBMIT = 'submit',
    ERROR = 'error',
    SUCCESS = 'success'
}

const enum ReqType {
    CREATE = 'create',
    UPDATE = 'update'
}

export class DirectSubmitRequest {
    private __created: Date;
    private __file: File;
    private __format: string;
    private __log: any;
    private __status: ReqStatus = ReqStatus.CONVERT;
    private __type: ReqType;
    private __subm: any;

    private constructor(file: File, format: string, type: ReqType) {
        this.__created = new Date();
        this.__file = file;
        this.__format = format;
        this.__type = type;
    }

    get failed(): boolean {
        return this.__status === ReqStatus.ERROR;
    }

    get successful(): boolean {
        return this.__status === ReqStatus.SUCCESS;
    }

    get done(): boolean {
        return this.failed || this.successful;
    }

    get inprogress(): boolean {
        return !this.done;
    }

    get status(): ReqStatus {
        return this.__status;
    }

    get format(): string {
        return this.__format;
    }

    get formatText(): string {
        return this.format || '<auto-detect>';
    }

    get created(): Date {
        return this.__created;
    }

    get file(): File {
        return this.__file;
    }

    get filename(): string {
        return this.__file.name;
    }

    get log(): any {
        return this.__log || {};
    }

    get subm(): any {
        return this.__subm || {};
    }

    onConversionFinished(res: any): void {
        if (res.status === 'FAIL') {
            this.__log = res.log;
            this.__status = ReqStatus.ERROR;
            return;
        }
        this.__status = ReqStatus.SUBMIT;
        this.__subm = res.document.submissions[0];
    }

    onSubmitFinished(res: any): void {
        this.__log = res.log;
        this.__status = res.status === 'FAIL' ? ReqStatus.ERROR : ReqStatus.SUCCESS;
    }

    static newCreateRequest(file: File, format: string) {
        return new DirectSubmitRequest(file, format, ReqType.CREATE);
    }

    static newUpdateRequest(file: File, format: string) {
        return new DirectSubmitRequest(file, format, ReqType.UPDATE);
    }
}

@Injectable()
export class DirectSubmitService {

    newRequest$: Subject<Number> = new Subject<Number>();

    private allRequests = [];
    private newSubmitRequest$: Subject<Number> = new Subject<Number>();

    constructor(@Inject(SubmissionService) private submService: SubmissionService) {
        this.newRequest$.subscribe(index => this.convert(index));
        this.newSubmitRequest$.subscribe(index => this.submit(index));
    }

    create(file: File, format: string): void {
        this.addRequest(DirectSubmitRequest.newCreateRequest(file, format));
    }

    update(file: File, format: string): void {
        this.addRequest(DirectSubmitRequest.newUpdateRequest(file, format));
    }

    request(index: Number) {
        if (index >= 0 && index < this.allRequests.length) {
            return this.allRequests[index];
        }
        console.warn('DirectSubmitRequest index out of bounds: ' + index);
        return undefined;
    }

    private addRequest(req: DirectSubmitRequest): void {
        const index = this.allRequests.length;
        this.allRequests.push(req);
        this.newRequest$.next(index);
    }

    private convert(index: number): void {
        const req = this.request(index);
        if (!req) {
            return;
        }
        this.submService.formSubmit('CONVERT', req.file, req.format)
            .subscribe(
                data => {
                    req.onConversionFinished(data);
                    this.newSubmitRequest$.next(index);
                },
                error => {
                    const status = error.status || '';
                    const statusText = error.statusText || '';
                    const statusLine = (status ? status + ': ' : '') + (statusText ? statusText : '');
                    req.onConversionFinished({
                        status: "FAIL",
                        log: {
                            "level": "ERROR",
                            "message": "Submit request failed. " + statusLine
                        }
                    });
                });
    }

    private submit(index: number): void {
        const req = this.request(index);
        if (!req || req.failed) {
            return;
        }
        /*this.submService,directSubmit(req.subm, req.type)
            .subscribe(
                data => {
                    req.onSubmitFinished(data);
                },
                error => {
                    const status = error.status || '';
                    const statusText = error.statusText || '';
                    const statusLine = (status ? status + ': ' : '') + (statusText ? statusText : '');
                    req.onSubmitFinished({
                        status: "FAIL",
                        log: {
                            "level": "ERROR",
                            "message": "Submit request failed. " + statusLine
                        }
                    });
                });
                */

    }
}
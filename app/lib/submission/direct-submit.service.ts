import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {SubmissionService} from './submission.service';
import {PageTabProxy} from './pagetabproxy';

const enum ReqStatus {CONVERT, SUBMIT, ERROR, SUCCESS}

const enum ReqType {CREATE, UPDATE}

export class DirectSubmitRequest {
    private __filename: string;
    private __format: string;
    private __projects: string[];
    private __type: ReqType;

    private __created: Date;
    private __status: ReqStatus;
    private __log: any;

    constructor(filename: string, format: string, projects: string[], type: ReqType) {
        this.__filename = filename;
        this.__format = format;
        this.__projects = projects;
        this.__type = type;

        this.__created = new Date();
        this.__status = ReqStatus.CONVERT;
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

    get statusText(): string {
        return ReqStatus[this.__status];
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

    get filename(): string {
        return this.__filename;
    }

    get projects(): string[] {
        return this.__projects;
    }

    get type(): ReqType {
        return this.__type;
    }

    get log(): any {
        return this.__log || {};
    }

    onConvertResponse(res: any): void {
        this.onResponse(res, ReqStatus.SUBMIT);
    }

    onSubmitResponse(res: any): void {
        this.onResponse(res, ReqStatus.SUCCESS);
    }

    private onResponse(res: any, successStatus: ReqStatus): void {
        if (res.status === 'FAIL') {
            this.__log = res.log;
            this.__status = ReqStatus.ERROR;
            return;
        }
        this.__status = successStatus;
        this.__log = res.log || undefined;
    }
}

@Injectable()
export class DirectSubmitService {

    newRequest$: Subject<Number> = new Subject<Number>();

    private requests: DirectSubmitRequest[] = [];

    constructor(@Inject(SubmissionService) private submService: SubmissionService) {
    }

    create(file: File, format: string, projects: string[]): void {
        this.addRequest(file, format, projects, ReqType.CREATE);
    }

    update(file: File, format: string, projects: string[]): void {
        this.addRequest(file, format, projects, ReqType.UPDATE);
    }

    request(index: Number) {
        if (index >= 0 && index < this.requests.length) {
            return this.requests[index];
        }
        console.warn('DirectSubmitRequest index out of bounds: ' + index);
        return undefined;
    }

    private addRequest(file: File, format: string, projects: string[], type: ReqType): void {
        const req = new DirectSubmitRequest(file.name, format, projects, type);
        const index = this.requests.length;
        this.requests.push(req);
        this.newRequest$.next(index);

        this.convert(req, file, format);
    }

    private convert(req: DirectSubmitRequest, file: File, format: string): void {
        this.submService.convert(file, format)
            .subscribe(
                data => {
                    this.onConvertRequestFinished(req, data);
                }
            );
    }

    private submit(req: DirectSubmitRequest, subm: any): void {
        const pt:PageTabProxy = PageTabProxy.create(subm);
        pt.attachTo = req.projects;
        this.submService.directCreateOrUpdate(pt.data, req.type === ReqType.CREATE)
            .subscribe(
                data => {
                    this.onSubmitRequestFinished(req, data);
                });
    }

    private onConvertRequestFinished(req: DirectSubmitRequest, resp: any) {
        req.onConvertResponse(resp);
        if (!req.failed) {
            this.submit(req, resp.document.submissions[0]);
        }
    }

    private onSubmitRequestFinished(req: DirectSubmitRequest, resp: any) {
        req.onSubmitResponse(resp);
    }
}
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Subject} from 'rxjs/Subject';

import {SubmissionService} from './submission.service';
import {PageTabProxy} from './model/pagetabproxy';
import {ServerError} from '../http/index';

enum ReqStatus {CONVERT, SUBMIT, ERROR, SUCCESS}

enum ReqType {CREATE, UPDATE}

export class DirectSubmitRequest {
    private _filename: string;
    private _format: string;
    private _projects: string[];
    private _type: ReqType;

    private _created: Date;
    private _status: ReqStatus;
    private _log: any;

    constructor(filename: string, format: string, projects: string[], type: ReqType) {
        this._filename = filename;
        this._format = format;
        this._projects = projects;
        this._type = type;

        this._created = new Date();
        this._status = ReqStatus.CONVERT;
    }

    get failed(): boolean {
        return this._status === ReqStatus.ERROR;
    }

    get successful(): boolean {
        return this._status === ReqStatus.SUCCESS;
    }

    get done(): boolean {
        return this.failed || this.successful;
    }

    get inprogress(): boolean {
        return !this.done;
    }

    get statusText(): string {
        return ReqStatus[this._status];
    }

    get format(): string {
        return this._format;
    }

    get formatText(): string {
        return this.format || '<auto-detect>';
    }

    get created(): Date {
        return this._created;
    }

    get filename(): string {
        return this._filename;
    }

    get projects(): string[] {
        return this._projects;
    }

    get type(): ReqType {
        return this._type;
    }

    get log(): any {
        return this._log || {};
    }

    onConvertResponse(res: any): void {
        this.onResponse(res, ReqStatus.SUBMIT);
    }

    onSubmitResponse(res: any): void {
        this.onResponse(res, ReqStatus.SUCCESS);
    }

    private onResponse(res: any, successStatus: ReqStatus): void {
        if (res.status !== 'OK') {
            this._log = res.log || {message: 'no results available', level: 'error'};
            this._status = ReqStatus.ERROR;
            return;
        }
        this._status = successStatus;
        this._log = res.log || undefined;
    }
}

@Injectable()
export class DirectSubmitService {

    newRequest$: Subject<Number> = new Subject<Number>();

    private requests: DirectSubmitRequest[] = [];

    constructor(private submService: SubmissionService) {
    }

    create(file: File, format: string, projects: string[]): void {
        this.addRequest(file, format, projects, ReqType.CREATE);
    }

    update(file: File, format: string, projects: string[]): void {
        this.addRequest(file, format, projects, ReqType.UPDATE);
    }

    request(index: number) {
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
                },
                (error: Response) => {
                    const err = ServerError.fromResponse(error);
                    this.onConvertRequestFinished(req, err.data || {});
                    if (!err.isInputError()) {
                        setTimeout(function() {
                            throw err;
                        }, 10);
                    }
                }
            );
    }

    private submit(req: DirectSubmitRequest, subm: any): void {
        const pt: PageTabProxy = PageTabProxy.create(subm);
        pt.attachTo = req.projects;
        this.submService.directCreateOrUpdate(pt.data, req.type === ReqType.CREATE)
            .subscribe(
                data => {
                    this.onSubmitRequestFinished(req, data);
                },
                (error: Response) => {
                    const err = ServerError.fromResponse(error);
                    this.onSubmitRequestFinished(req, err.data || {});
                    if (!err.isInputError()) {
                        setTimeout(function() {
                            throw err;
                        }, 10);
                    }
                }
            );
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
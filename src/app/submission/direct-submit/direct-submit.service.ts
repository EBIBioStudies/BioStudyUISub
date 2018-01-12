import {Injectable} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {SubmissionService} from '../shared/submission.service';
import {PageTabProxy} from 'app/submission-model/index';
import {ServerError} from 'app/http/index';
import {Observable} from "rxjs/Observable";

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
    private _accno: string =  '';

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
        return this.format || 'auto-detect';
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

    get accno(): any {
        return this._accno;
    }

    //Handler for responses from conversion or final submission
    onResponse(res: any, successStatus: ReqStatus): void {

        //Failed server response from direct submit => reflects failure in this request object
        if (res.status !== 'OK') {
            this._status = ReqStatus.ERROR;
            this._log = res.log || {message: 'no results available', level: 'error'};

        //Successful server response from direct submit => reflects success accordingly
        } else {
            this._status = successStatus;
            this._log = res.log || undefined;

            //If the response is from final submit request, exposes the accession number
            if (successStatus == ReqStatus.SUCCESS) {
                this._accno = res.mapping[0].assigned;
            }
        }
    }
}

@Injectable()
export class DirectSubmitService {

    newRequest$: Subject<Number> = new Subject<Number>();

    private requests: DirectSubmitRequest[] = [];

    constructor(private submService: SubmissionService) {
    }

    request(index: number) {
        if (index >= 0 && index < this.requests.length) {
            return this.requests[index];
        }
        console.warn('DirectSubmitRequest index out of bounds: ' + index);
        return undefined;
    }

    addRequest(file: File, format: string, projects: string[], type: string): Observable<any> {
        const req = new DirectSubmitRequest(file.name, format, projects, ReqType[type.toUpperCase()]);
        const index = this.requests.length;
        this.requests.push(req);
        this.newRequest$.next(index);

        return this.convert(req, file, format);
    }

    //TODO: There is a lot of code in common between the methods below. Refactor using RxJS' concat and finally operators to dry it out.
    private convert(req: DirectSubmitRequest, file: File, format: string): Observable<any> {
        return this.submService.convert(file, format).map(

            //Updates request object's state and submits if successful
            data => {
                req.onResponse(data, ReqStatus.SUBMIT);
                !req.failed && this.submit(req, data.document.submissions[0]);

            //Updates request object's state and bubbles server error up to support additional subscriptions
            }).catch((error: any) => {
                req.onResponse(error.data || {}, ReqStatus.SUBMIT);
                if (!error.isDataError) {
                    throw error;
                }
                return Observable.throw(error);
            });
    }

    //TODO: incorporate create request to event stream used for the convert one. Otherwise,
    private submit(req: DirectSubmitRequest, subm: any): void {
        let pt: PageTabProxy;

        //Prepares the payload
        pt = PageTabProxy.create(subm);
        pt.attachTo = req.projects;

        //Updates request object's state
        this.submService.directCreateOrUpdate(pt.data, req.type === ReqType.CREATE).subscribe(
            data => {
                    req.onResponse(data, ReqStatus.SUCCESS);
            },
            (error: ServerError) => {     //NOTE: ServerErrors have the whole error object under a "data" property
                req.onResponse(error.data.error || {}, ReqStatus.SUCCESS);
                if (!error.isDataError) {
                    throw error;
                }
            }
        );
    }
}
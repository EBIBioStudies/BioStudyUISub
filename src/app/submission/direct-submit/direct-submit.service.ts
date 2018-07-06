import {Injectable} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {SubmissionService} from '../shared/submission.service';
import {Observable} from "rxjs/Observable";
import {attachTo} from '../shared/pagetab-attributes.utils';

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
    private _releaseDate: string;

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

    get errorMessage(): string {
        if (this.failed) {
            return SubmissionService.deepestError(this._log);
        } else {
            return '';
        }
    }

    get accno(): string {
        return this._accno;
    }

    get releaseDate(): string {
        return this._releaseDate;
    }

    /**
     * Handler for responses from conversion or final submission, updating request status accordingly.
     * @param {Object} res - Data object representative of response to the request.
     * @param {ReqStatus} successStatus - Used when the request has been successful to determine the upload stage.
     */
    onResponse(res: any, successStatus: ReqStatus): void {

        //Failed server response from direct submit => reflects failure in this request object ignoring passed-in status
        if (res.status !== 'OK') {
            this._status = ReqStatus.ERROR;

            //Normalises error to object
            if (typeof res === 'string') {
                this._log = {message: res, level: 'error'};
            } else {
                this._log = res.log || {message: 'No results available', level: 'error'};
            }

        //Successful server response from direct submit => reflects success accordingly
        } else {
            this._status = successStatus;
            this._log = res.log || undefined;

            //If the response is from final submit request, exposes the accession number
            if (successStatus == ReqStatus.SUCCESS) {
                this._accno = res.mapping[0].assigned;

            //If back from conversion, extracts the release date if found.
            } else if (successStatus == ReqStatus.SUBMIT) {
                let dateAttr = res.document.submissions[0].attributes;

                //NOTE: The server may come back with no root-level attributes despite PageTab requirements
                dateAttr = dateAttr && dateAttr.find(attribute => {
                    return attribute.name == 'ReleaseDate';
                });

                if (dateAttr) {
                    this._releaseDate = dateAttr.value;
                }
            }
        }
    }
}

@Injectable()
export class DirectSubmitService {
    newRequest$: Subject<Number> = new Subject<Number>();
    private _requests: DirectSubmitRequest[] = [];

    constructor(private submService: SubmissionService) {}

    get requestCount(): number {
        return this._requests.length;
    }

    get pendingCount(): number {
        return this._requests.filter(request => !request.done).length;
    }

    get errorCount(): number {
        return this._requests.filter(request => request.failed).length;
    }

    getRequest(index: number) {
        if (index >= 0 && index < this._requests.length) {
            return this._requests[index];
        } else {
            return undefined;
        }
    }

    /**
     * Checks the overall status of the request queue by probing its members.
     * @param {string} statusName - Descriptive name of the status.
     * @returns {boolean} True if the queue is with the status checked.
     */
    isQueueStatus(statusName: string): boolean {
        let condition = 'some';

        if (statusName == 'busy') {
            statusName = 'inprogress';
        } else if (statusName == 'successful' || statusName == 'done') {
            condition = 'every';
        }

        return this._requests[condition](request => {
            return request[statusName];
        });
    }

    /**
     * Given a study file an its properties, it adds a new request to the queue and starts the submission process.
     * @param {File} file - Object representative of the file to be submitted.
     * @param {string} format - Format of the file. If omitted, it automatically detects it.
     * @param {string[]} projects - Projects the file should be attached to.
     * @param {string} type - Indicates whether the submitted file should create or update an existing database entry.
     * @returns {Observable<any>} Stream of inputs coming from the subsequent responses.
     */
    addRequest(file: File, format: string, projects: string[], type: string): Observable<any> {
        const req = new DirectSubmitRequest(file.name, format, projects, ReqType[type.toUpperCase()]);
        const index = this._requests.length;

        this._requests.push(req);
        this.newRequest$.next(index);

        return this.dirSubmit(req, file, format);
    }

    /**
     * Wipes out the request queue in case a new battery of requests is going to be issued.
     */
    reset() {
        this._requests.length = 0;
    }

    /**
     * Marks all requests as failed at once.
     */
    cancelAll() {
        this._requests.forEach(request => {
            if (!request.successful && !request.done) {
                request.onResponse('Upload cancelled', ReqStatus.ERROR);
            }
        });
    }

    /**
     * Makes the two inter-dependent requests necessary to submit a given file.
     * @param {DirectSubmitRequest} req - Request object to be updated on response.
     * @param {File} file - Object representative of the file to be submitted.
     * @param {string} format - Format of the file. If omitted it automatically detects it.
     * @returns {Observable<any>} Flat stream of inputs coming from the responses to the requests issued.
     */
    private dirSubmit(req: DirectSubmitRequest, file: File, format: string): Observable<any> {
        return this.submService.convert(file, format).switchMap(

            //Signals the successful completion of the conversion stage and submits if successful
            data => {
                req.onResponse(data, ReqStatus.SUBMIT);
                return this.submit(req, data.document.submissions[0]);

            //Finds where the relevant error data is before updating the request's status accordingly.
            //This block will catch errors from either conversion or submission.
            }).catch((error: any) => {
                let errData = error.data;

                if (errData && errData.hasOwnProperty('error')) {
                    errData = error.data.error;
                } else if (!errData) {
                    errData = {};
                }

                req.onResponse(errData, ReqStatus.ERROR);

                //NOTE: an empty observable is used instead of throwing an exception to prevent this transaction
                //cancelling any remaining ones.
                return Observable.of(null);
            }
        );
    }

    /**
     * Makes the request to create or update the study. While at it, it updates the study with the projects
     * it is meant to be attached to.
     * @param {DirectSubmitRequest} req - Status object representing the request.
     * @param {Object} subm - Submission object for the study to be created or updated.
     * @returns {Observable<any>} - Stream of events for the request.
     */
    private submit(req: DirectSubmitRequest, subm: any): Observable<any> {
        return this.submService.directCreateOrUpdate(
            attachTo(subm, req.projects),
            req.type === ReqType.CREATE
        ).map(data => {
            req.onResponse(data, ReqStatus.SUCCESS);
        });
    }
}
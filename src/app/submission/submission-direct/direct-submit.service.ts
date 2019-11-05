import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubmissionService, SubmitResponse } from '../submission-shared/submission.service';

enum ReqStatus {SUBMIT, ERROR, SUCCESS}

enum ReqType {CREATE, UPDATE}

export class DirectSubmitRequest {
    private _filename: string;
    private _projects: string[];
    private _type: ReqType;

    private _created: Date;
    private _status: ReqStatus;
    private _log: any;
    private _accno: string = '';
    private _releaseDate: string | undefined;

    constructor(filename: string, projects: string[], type: ReqType) {
        this._filename = filename;
        this._projects = projects;
        this._type = type;

        this._created = new Date();
        this._status = ReqStatus.SUBMIT;
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
        if (this.failed && this._log !== undefined) {
            return this._log.message;
        } else {
            return 'There was an error processing the study';
        }
    }

    get accno(): string {
        return this._accno;
    }

    get releaseDate(): string | undefined {
        return this._releaseDate;
    }

    /**
     * Handler for responses from conversion or final submission, updating request status accordingly.
     * @param {Object} res - Data object representative of response to the request.
     * @param {ReqStatus} successStatus - Used when the request has been successful to determine the upload stage.
     */
    onResponse(res: SubmitResponse | string, successStatus: ReqStatus): void {

        // Normalises error to object
        if (typeof res === 'string') {
            this._log = {message: res, level: 'error'};
        } else if (res.log && res.log.level === 'ERROR') {
           // Failed server response from direct submit => reflects failure in this request object ignoring passed-in status
            this._status = ReqStatus.ERROR;
            this._log = res.log || {message: 'No results available', level: 'error'};

        // Successful server response from direct submit => reflects success accordingly
        } else {
            this._status = successStatus;
            this._log = res.log || undefined;

            // exposes the accession number
            this._accno = res.accno;
        }
    }
}

@Injectable()
export class DirectSubmitService {
    newRequest$: Subject<Number> = new Subject<Number>();
    private _requests: DirectSubmitRequest[] = [];

    constructor(private submService: SubmissionService) {
    }

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
     *
     * @param {string} statusName - Descriptive name of the status.
     * @returns {boolean} True if the queue is with the status checked.
     */
    isQueueStatus(statusName: string): boolean {
        let condition = 'some';

        if (statusName === 'busy') {
            statusName = 'inprogress';
        } else if (statusName === 'successful' || statusName === 'done') {
            condition = 'every';
        }

        return this._requests[condition](request => request[statusName]);
    }

    /**
     * Given a study file an its properties, it adds a new request to the queue and starts the submission process.
     * @param {File} file - Object representative of the file to be submitted.
     * @param {string[]} projects - Projects the file should be attached to.
     * @param {string} type - Indicates whether the submitted file should create or update an existing database entry.
     * @returns {Observable<any>} Stream of inputs coming from the subsequent responses.
     */
    addRequest(file: File, projects: string[], type: string): Observable<any> {
        const req = new DirectSubmitRequest(file.name, projects, ReqType[type.toUpperCase()]);
        const index = this._requests.length;

        this._requests.push(req);
        this.newRequest$.next(index);

        return this.dirSubmit(req, file);
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
     * @returns {Observable<any>} Flat stream of inputs coming from the responses to the requests issued.
     */
    private dirSubmit(req: DirectSubmitRequest, file: File): Observable<any> {
        return this.submService.directSubmit(file, req.projects).pipe(
            map(data => {
                req.onResponse(data, ReqStatus.SUCCESS);
            }),
            catchError((error: any) => {
                req.onResponse(error.error || 'unknown error', ReqStatus.ERROR);

                // NOTE: an empty observable is used instead of throwing an exception to prevent this transaction
                // cancelling any remaining ones.
                return of(null);
            }));
    }
}

import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubmissionService, SubmitResponse } from '../submission-shared/submission.service';

enum ReqStatus {
  SUBMIT,
  ERROR,
  SUCCESS
}

export class DirectSubmitRequest {
  private directSubmissionAccno: string = '';
  private directSubmissionCreated: Date;
  private directSubmissionFilename: string;
  private directSubmissionLog: any;
  private directSubmissionProject: string;
  private directSubmissionReleaseDate: string | undefined;
  private directSubmissionStatus: ReqStatus;

  constructor(filename: string, project: string) {
    this.directSubmissionFilename = filename;
    this.directSubmissionProject = project;

    this.directSubmissionCreated = new Date();
    this.directSubmissionStatus = ReqStatus.SUBMIT;
  }

  get failed(): boolean {
    return this.directSubmissionStatus === ReqStatus.ERROR;
  }

  get successful(): boolean {
    return this.directSubmissionStatus === ReqStatus.SUCCESS;
  }

  get done(): boolean {
    return this.failed || this.successful;
  }

  get inprogress(): boolean {
    return !this.done;
  }

  get statusText(): string {
    return ReqStatus[this.directSubmissionStatus];
  }

  get created(): Date {
    return this.directSubmissionCreated;
  }

  get filename(): string {
    return this.directSubmissionFilename;
  }

  get project(): string {
    return this.directSubmissionProject;
  }

  get log(): any {
    return this.directSubmissionLog || {};
  }

  get errorMessage(): string {
    if (this.failed && this.directSubmissionLog !== undefined) {
      return this.directSubmissionLog.message;
    } else {
      return 'There was an error processing the study';
    }
  }

  get accno(): string {
    return this.directSubmissionAccno;
  }

  get releaseDate(): string | undefined {
    return this.directSubmissionReleaseDate;
  }

  private extractReleaseDate(res: SubmitResponse): string {
    const { attributes = [], section } = res;
    let releaseDate;

    if (attributes.length > 0) {
      const releaseDateAttribute = attributes.find((attribute) => attribute.name === 'ReleaseDate');

      releaseDate = releaseDateAttribute ? releaseDateAttribute.value : null;
    }

    if (!releaseDate && section && section.attributes && section.attributes.length > 0) {
      const releaseDateAttribute = section.attributes.find((attribute) => attribute.name === 'ReleaseDate');

      releaseDate = releaseDateAttribute ? releaseDateAttribute.value : null;
    }

    return releaseDate;
  }

  /**
   * Handler for responses from conversion or final submission, updating request status accordingly.
   * @param res - Data object representative of response to the request.
   * @param successStatus - Used when the request has been successful to determine the upload stage.
   */
  onResponse(res: SubmitResponse | string, successStatus: ReqStatus): void {
    // Normalises error to object
    if (typeof res === 'string') {
      this.directSubmissionLog = { message: res, level: 'error' };
    } else if (res.log && res.log.level === 'ERROR') {
      // Failed server response from direct submit => reflects failure in this request object ignoring passed-in status
      this.directSubmissionStatus = ReqStatus.ERROR;
      this.directSubmissionLog = res.log || { message: 'No results available', level: 'error' };

      // Successful server response from direct submit => reflects success accordingly
    } else {
      this.directSubmissionStatus = successStatus;
      this.directSubmissionLog = res.log || undefined;

      // exposes the accession number
      this.directSubmissionAccno = res.accno;
      this.directSubmissionReleaseDate = this.extractReleaseDate(res);
    }
  }
}

@Injectable()
export class DirectSubmitService {
  newRequest$: Subject<number> = new Subject<number>();
  private requests: DirectSubmitRequest[] = [];

  constructor(private submService: SubmissionService) {}

  get requestCount(): number {
    return this.requests.length;
  }

  get pendingCount(): number {
    return this.requests.filter((request) => !request.done).length;
  }

  get errorCount(): number {
    return this.requests.filter((request) => request.failed).length;
  }

  /**
   * Given a study file an its properties, it adds a new request to the queue and starts the submission process.
   * @param file - Object representative of the file to be submitted.
   * @param projects- Project the file should be attached to.
   * @param type - Indicates whether the submitted file should create or update an existing database entry.
   * @returns Stream of inputs coming from the subsequent responses.
   */
  addRequest(file: File, project: string): Observable<any> {
    const req = new DirectSubmitRequest(file.name, project);
    const index = this.requests.length;

    this.requests.push(req);
    this.newRequest$.next(index);

    return this.dirSubmit(req, file);
  }

  /**
   * Marks all requests as failed at once.
   */
  cancelAll(): void {
    this.requests.forEach((request) => {
      if (!request.successful && !request.done) {
        request.onResponse('Upload cancelled', ReqStatus.ERROR);
      }
    });
  }

  getRequest(index: number): DirectSubmitRequest | undefined {
    if (index >= 0 && index < this.requests.length) {
      return this.requests[index];
    } else {
      return undefined;
    }
  }

  /**
   * Checks the overall status of the request queue by probing its members.
   *
   * @param statusName - Descriptive name of the status.
   * @returns True if the queue is with the status checked.
   */
  isQueueStatus(statusName: string): boolean {
    let condition = 'some';

    if (statusName === 'busy') {
      statusName = 'inprogress';
    } else if (statusName === 'successful' || statusName === 'done') {
      condition = 'every';
    }

    return this.requests[condition]((request) => request[statusName]);
  }

  /**
   * Wipes out the request queue in case a new battery of requests is going to be issued.
   */
  reset(): void {
    this.requests.length = 0;
  }

  /**
   * Makes the two inter-dependent requests necessary to submit a given file.
   * @param req - Request object to be updated on response.
   * @param file - Object representative of the file to be submitted.
   * @returns Flat stream of inputs coming from the responses to the requests issued.
   */
  private dirSubmit(req: DirectSubmitRequest, file: File): Observable<any> {
    return this.submService.directSubmit(file, req.project).pipe(
      map((data) => {
        req.onResponse(data, ReqStatus.SUCCESS);
      }),
      catchError((error: any) => {
        req.onResponse(error.error || 'unknown error', ReqStatus.ERROR);

        // NOTE: an empty observable is used instead of throwing an exception to prevent this transaction
        // cancelling any remaining ones.
        return of(null);
      })
    );
  }
}

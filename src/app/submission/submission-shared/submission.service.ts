import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PageTab, DraftPayload } from './model/pagetab';
import { SubmissionDraftUtils } from './utils/submission-draft.utils';

export interface DraftSubmission {
    accno: string,
    changed: number,
    data: PageTab
}

export interface SubmissionListItem {
    accno: string,
    title: string,
    rtime: number,
    mtime: number,
    status: string
}

export interface SubmitResponse {
    accno: string,
    status: string,
    mapping: Array<any>,
    log: SubmitLog,
    document?: any
}

export interface SubmitLog {
    level: string, // 'INFO'|'WARN'|'ERROR'
    message: string,
    subnodes: Array<SubmitLog>
}

export interface SubmissionListParams {
    offset?: number,
    limit?: number,
    accNo?: string,
    rTimeFrom?: number,
    rTimeTo?: number,
    keywords?: string[]
}

function definedPropertiesOnly(obj: any): any {
    if (obj === null || obj === undefined || (typeof obj !== 'object')) {
        return obj;
    }
    const result = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null) {
            let value = obj[key];
            if (typeof obj[key] === 'object') {
                value = definedPropertiesOnly(value);
            }
            result[key] = value;
        }
    });
    return result;
}

@Injectable()
export class SubmissionService {
    private submissionDraftUtils: SubmissionDraftUtils;

    /**
     * Traverses the error log tree to find the first deepest error message.
     * @param {Array<Object> | Object} obj - Log tree's root node or subnode list.
     * @returns {string} Error message.
     */
    static deepestError(log: SubmitLog): string {
        const errorNode = (log.subnodes || []).find(n => n.level === 'ERROR');

        if (errorNode === undefined) {
            return log.message || 'Unknown error';
        }

        return this.deepestError(errorNode);
    }

    constructor(
        private http: HttpClient
    ) {
        this.submissionDraftUtils = new SubmissionDraftUtils();
    }

    getSubmissions(submitted: boolean, params: SubmissionListParams = {}): Observable<SubmissionListItem[]> {
        const url = submitted ? '/api/submissions' : '/api/submissions/drafts';

        return this.http.get<SubmissionListItem[]>(url, { params: definedPropertiesOnly(params) }).pipe(
            map((items) => {
                return submitted ? items : this.submissionDraftUtils.filterAndFormatDraftSubmissions(items);
            })
        );
    }

    getProjects(): Observable<any> {
        return this.http.get('/api/projects');
    }

    createDraftSubmission(pt: PageTab): Observable<string> {
        return this.http.post<DraftPayload>('/api/submissions/drafts', pt).pipe(
            map((response) => response.key)
        );
    }

    getSubmission(accno: string): Observable<PageTab> {
        return this.getDraft(accno);
    }

    saveDraftSubmission(accno: string, pt: PageTab): Observable<any> {
        return this.http.put<PageTab>(`/api/submissions/drafts/${accno}`, pt).pipe(map(() => 'done'));
    }

    submitSubmission(pt: PageTab): Observable<SubmitResponse> {
        const headers: HttpHeaders = new HttpHeaders().set('Submission_Type', 'application/json');

        return this.http.post<SubmitResponse>('/api/submissions', pt, { headers });
    }

    directSubmit(file: File, create: boolean, attachTo: Array<string> = []): Observable<SubmitResponse> {
        const operation = create ? 'CREATE' : 'CREATE_OR_UPDATE';
        const formData = new FormData();
        attachTo.forEach(projectName => {
            formData.append('attachTo', projectName);
        });
        formData.append('submission', file);
        return this.http.post<SubmitResponse>(`/api/submissions/direct`, formData);
    }

    deleteSubmission(accno: string): Observable<boolean> {
        return this.getDraft(accno).pipe(
            catchError(_ => of(undefined)),
            switchMap(resp => resp === undefined ? this.deleteSubmitted(accno) : this.deleteDraft(accno))
        );
    }

    private deleteSubmitted(accno: string): Observable<boolean> {
        // todo: Why GET ??!!!
        return this.http.get(`/api/submit/delete?id=${accno}`).pipe(
            map(resp => resp['level'] === 'success')
        );
    }

    private deleteDraft(accno: string): Observable<boolean> {
        return this.http.delete(`/api/submissions/drafts/${accno}`).pipe(map(() => true));
    }

    private getDraft(accno: string): Observable<PageTab> {
        return this.http.get<PageTab>(`/api/submissions/drafts/${accno}/content`);
    }

    private getSubmitted(accno: string): Observable<PageTab> {
        return this.http.get<PageTab>(`/api/submissions/${accno}.json`);
    }
}

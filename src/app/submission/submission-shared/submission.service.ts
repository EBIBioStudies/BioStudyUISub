import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PageTab } from './model/pagetab';
import { LogService } from 'app/logger/log.service';

export interface PendingSubmission {
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

    constructor(private http: HttpClient) {
    }

    getSubmissions(submitted: boolean, params: SubmissionListParams = {}): Observable<SubmissionListItem[]> {
        const url = submitted ? '/raw/submissions' : '/raw/submissions/pending';

        return this.http.get<SubmissionListItem[]>(url, {params: definedPropertiesOnly(<any>params)});
    }

    getProjects(): Observable<any> {
        return this.http.get('/raw/projects');
    }

    createSubmission(pt: PageTab): Observable<PendingSubmission> {
        return this.http.post<PendingSubmission>('/raw/submissions/pending', pt);
    }

    getSubmission(accno: string): Observable<PendingSubmission> {
        return this.getPending(accno).pipe(
            catchError(() =>
                this.getSubmitted(accno).pipe(
                    map(resp => ({
                        accno: accno,
                        changed: 0,
                        data: resp
                    }))
                )));
    }

    saveSubmission(accno: string, pt: PageTab): Observable<any> {
        return this.http.put<PendingSubmission>(`/raw/submissions/pending/${accno}`, pt).pipe(
            catchError((resp: HttpErrorResponse) => {
                if (resp.status === 400) {
                    return this.createSubmission(pt);
                }
                throw resp;
            }),
            map(() => 'done')
        );
    }

    submitSubmission(accno: string, pt: PageTab): Observable<SubmitResponse> {
        return this.http.post<SubmitResponse>(`/raw/submissions/pending/${accno}/submit`, pt);
    }

    directSubmit(file: File, create: boolean, attachTo: Array<string> = []): Observable<SubmitResponse> {
        const operation = create ? 'CREATE' : 'CREATE_OR_UPDATE';
        const formData = new FormData();
        attachTo.forEach(projectName => {
            formData.append('attachTo', projectName);
        });
        formData.append('submission', file);
        return this.http.post<SubmitResponse>(`/raw/submissions/direct`, formData);
    }

    deleteSubmission(accno: string): Observable<boolean> {
        return this.getPending(accno).pipe(
            catchError(_ => of(undefined)),
            switchMap(resp => resp === undefined ? this.deleteSubmitted(accno) : this.deletePending(accno))
        );
    }

    private deleteSubmitted(accno: string): Observable<boolean> {
        // todo: Why GET ??!!!
        return this.http.get(`/raw/submit/delete?id=${accno}`).pipe(
            map(resp => resp['level'] === 'success')
        );
    }

    private deletePending(accno: string): Observable<boolean> {
        return this.http.delete(`/raw/submissions/pending/${accno}`).pipe(
            map(() => true)
        );
    }

    private getPending(accno: string): Observable<PendingSubmission> {
        return this.http.get<PendingSubmission>(`/raw/submissions/pending/${accno}`);
    }

    private getSubmitted(accno: string): Observable<PageTab> {
        return this.http.get<PageTab>(`/raw/submission/${accno}`);
    }
}

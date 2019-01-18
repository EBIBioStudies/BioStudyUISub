import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {PageTab} from './model/pagetab';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
    log: SubmitLog
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

    constructor(private http: HttpClient) {
    }

    getSubmissions(submitted: boolean, params: SubmissionListParams = {}): Observable<SubmissionListItem[]> {
        const url = submitted ? '/raw/sbmlist' : '/raw/submissions/pending';
        return this.http.get<SubmissionListItem[]>(url, {params: definedPropertiesOnly(<any>params)}).pipe(
            map((response: any) => {
                return response.submissions;
            })
        );
    }

    getProjects(): Observable<any> {
        return this.http.get('/raw/atthost?type=Project&format=json').pipe(
            map((response: any) => {
                return response.submissions;
            })
        );
    }

    createSubmission(pt: any): Observable<PendingSubmission> {
        return this.http.post<PendingSubmission>('/raw/submissions/pending', pt);
    }

    getSubmission(accno: string): Observable<PendingSubmission> {
        return this.http.get<PendingSubmission>(`/api/submissions/pending/${accno}`);
    }

    saveSubmission(accno: string, pt: PageTab): Observable<any> {
        return this.http.put<PendingSubmission>(`/raw/submissions/pending/${accno}`, pt).pipe(
            map((response: any) => 'done')
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
        formData.append('file', file);
        return this.http.post<SubmitResponse>(`/raw/submissions/file_submit/${operation}`, formData);
    }

    deleteSubmission(accno) {
        return this.http.delete(`/api/submissions/${accno}`);
    }

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
}

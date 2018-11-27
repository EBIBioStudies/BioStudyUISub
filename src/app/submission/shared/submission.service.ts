import {Injectable} from '@angular/core';

import * as _ from 'lodash';

import {HttpCustomClient} from 'app/http/http-custom-client.service';
import {PageTab} from './model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

class UrlParams {
    private params: any[] = [];

    constructor(obj: any) {
        Object.keys(obj).forEach(k => {
            this.addParam(k, obj[k]);
        });
    }

    addParam(name, value) {
        this.params.push({name: name, value: value});
    }

    get list() {
        return this.params;
    }
}

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

@Injectable()
export class SubmissionService {

    constructor(private http: HttpCustomClient) {
    }

    getSubmission(accno: string): Observable<PendingSubmission> {
        return this.http.get(`/api/submissions/${accno}`);
    }

    getSubmittedSubmission(accno: string): Observable<PendingSubmission> {
        return this.http.get(`/api/submissions/origin/${accno}`);
    }

    getSubmissions(args: any = {}): Observable<SubmissionListItem[]> {
        const urlParams = new UrlParams(args);
        return this.http.get('/api/submissions', urlParams.list).pipe(
            map((response: any) => {
                return response.submissions;
            })
        );
    }

    getProjects(): Observable<any> {
        return this.http.get('/api/projects').pipe(
            map((response: any) => {
                return response.submissions;
            })
        );
    }

    createSubmission(pt: any): Observable<PendingSubmission> {
        return this.http.post('/api/submissions/tmp/create', pt);
    }

    saveSubmission(accno: string, pt: PageTab): Observable<any> {
        return this.http.post(`/api/submissions/pending/${accno}`, pt).pipe(
            map((response: any) => 'done')
        );
    }

    submitSubmission(accno: string, pt: PageTab): Observable<SubmitResponse> {
        return this.http.post(`/api/submissions/pending/${accno}/submit`, pt);
    }

    directCreateOrUpdate(pt: any, create: boolean): Observable<any> {
        return this.http.post(`/api/submissions/origin/submit?create=${create}`, pt);
    }

    convert(file: File, format: string = ''): Observable<any> {
        const formData = new FormData();
        formData.append('op', 'CONVERT');
        formData.append('type', format);
        formData.append('file', file);

        return this.http.post('/raw/formsubmit', formData);
    }

    deleteSubmission(accno) {
        return this.http.del('/api/submissions/' + accno);
    }

    /**
     * Traverses the error log tree to find the first deepest error message.
     * @param {Array<Object> | Object} obj - Log tree's root node or subnode list.
     * @returns {string} Error message.
     */
    static deepestError(log: SubmitLog): string {
        const errorNode = (log.subnodes||[]).find(n => n.level === 'ERROR');
        if (errorNode === undefined) {
            return log.message || 'Unknown error';
        }
        return this.deepestError(errorNode);
    }
}

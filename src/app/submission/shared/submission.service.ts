import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import * as _ from "lodash";

import {HttpCustomClient} from 'app/http/http-custom-client.service';
import {PageTab} from './pagetab.model';

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
        return this.http.get('/api/submissions', urlParams.list)
            .map((response: any) => {
                return response.submissions;
            });
    }

    getProjects(): Observable<any> {
        return this.http.get('/api/projects')
            .map((response: any) => {
                return response.submissions;
            });
    }

    createSubmission(pt: any): Observable<PendingSubmission> {
        return this.http.post('/api/submissions/tmp/create', pt);
    }

    saveSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/save', pt)
            .map((response: any) => 'done');
    }

    submitSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/submit', pt);
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
    static deepestError(obj: Array<Object> | Object | undefined): string | undefined {

        //Subnodes passed in => gets the first node out of all in the list that has an error
        if (Array.isArray(obj)) {
            return this.deepestError(obj.find(nestedObj => nestedObj['level'].toLowerCase() == 'error'));

        //Node passed in => only processes nodes with errors.
        } else if (_.isObject(obj) && obj!.hasOwnProperty('level') && obj!['level'].toLowerCase() == 'error') {

            //Travels down the hierarchy in search of deeper error nodes
            if (obj!.hasOwnProperty('subnodes')) {
                return this.deepestError(obj!['subnodes']);

            //Leaf error node reached => gets the error message proper.
            } else if (obj!.hasOwnProperty('message')) {
                return obj!['message'];
            }

        //The node had no error or was not a node anyway.
        } else {
            return '';
        }
    }
}

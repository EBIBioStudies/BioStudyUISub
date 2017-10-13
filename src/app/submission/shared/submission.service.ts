import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import {HttpCustomClient} from 'app/http/http-custom-client.service';

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

@Injectable()
export class SubmissionService {

    constructor(private http: HttpCustomClient) {
    }

    getSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/${accno}`);
    }

    getSubmittedSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/origin/${accno}`);
    }

    getSubmissions(args: any = {}): Observable<any> {
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

    createSubmission(pt: any): Observable<any> {
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
}

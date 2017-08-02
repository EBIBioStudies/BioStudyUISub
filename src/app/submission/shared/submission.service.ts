import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import {HttpClient} from 'app/http/http-client';

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

    constructor(private http: HttpClient) {
    }

    getSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/${accno}`)
            .map((res: Response) => res.json())
    }

    getSubmittedSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/origin/${accno}`)
            .map((res: Response) => res.json());
    }

    getSubmissions(args: any = {}): Observable<any> {
        const urlParams = new UrlParams(args);
        return this.http.get('/api/submissions', urlParams.list)
            .map((res: Response) => {
                return res.json().submissions;
            });
    }

    getProjects(): Observable<any> {
        return this.http.get('/api/projects')
            .map((res: Response) => {
                return res.json().submissions;
            });
    }

    createSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/create', pt)
            .map((res: Response) => res.json());
    }

    saveSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/save', pt)
            .map((res: Response) => {
            });
    }

    submitSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/submit', pt)
            .map((res: Response) => res.json());
    }

    directCreateOrUpdate(pt: any, create: boolean): Observable<any> {
        return this.http.post(`/api/submissions/origin/submit?create=${create}`, pt)
            .map((res: Response) => res.json());
    }

    convert(file: File, format: string = ''): Observable<any> {
        const formData = new FormData();
        formData.append('op', 'CONVERT');
        formData.append('type', format);
        formData.append('file', file);

        return this.http.post('/raw/formsubmit', formData)
            .map((res: Response) => res.json());
    }

    deleteSubmission(accno) {
        return this.http.del('/api/submissions/' + accno)
            .map((resp: Response) => resp.json());
    }
}

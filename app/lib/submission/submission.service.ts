import {Injectable, Optional} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import {SubmissionModuleConfig} from './submission.module.config';

class UrlParams {
    private params: any[] = [];

    constructor(obj: any) {
        for (let p in obj) {
            this.addParam(p, obj[p]);
        }
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

    private __errorHandler =
        (error: any) => {
            console.log(error);
            return Observable.throw(error);
        };

    constructor(private http: HttpClient,
                @Optional() submConfig: SubmissionModuleConfig) {
        if (submConfig) {
            this.__errorHandler = submConfig.httpErrorHandler;
        }
    }

    getSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/${accno}`)
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    getSubmittedSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/origin/${accno}`)
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    getSubmissions(args: any = {}): Observable<any> {
        let urlParams = new UrlParams(args);
        return this.http.get('/api/submissions', urlParams.list)
            .map((res: Response) => {
                return res.json().submissions;
            }).catch(this.__errorHandler);
    }

    getProjects(): Observable<any> {
        return this.http.get('/api/projects')
            .map((res: Response) => {
                return res.json().submissions;
            }).catch(this.__errorHandler);
    }

    createSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/create', pt)
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    saveSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/save', pt)
            .map((res: Response) => {
            })
            .catch(this.__errorHandler);
    }

    submitSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/submit', pt)
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    directCreateOrUpdate(pt: any, create: boolean): Observable<any> {
        return this.http.post(`/api/submissions/origin/submit?create=${create}`, pt)
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    convert(file: File, format: string = ''): Observable<any> {
        let formData = new FormData();
        formData.append('op', 'CONVERT');
        formData.append('type', format);
        formData.append('file', file);

        return this.http.post('/raw/formsubmit', formData)
            .map((res: Response) => res.json())
            .catch(this.__errorHandler);
    }

    deleteSubmission(accno) {
        return this.http.del('/api/submissions/' + accno)
            .map((resp: Response) => resp.json())
            .catch(this.__errorHandler);
    }
}
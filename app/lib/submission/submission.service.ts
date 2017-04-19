import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import {SharedService} from '../shared/index';

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

    constructor(@Inject(HttpClient) private http: HttpClient) {
    }

    getSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/${accno}`)
            .map((res: Response) => res.json())
            .catch(SharedService.errorHandler);
    }

    getSubmittedSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submissions/origin/${accno}`)
            .map((res: Response) => res.json())
            .catch(SharedService.errorHandler);
    }

    getSubmissions(args: any = {}): Observable<any> {
        let urlParams = new UrlParams(args);
        return this.http.get('/api/submissions', urlParams.list)
            .map((res: Response) => {
                return res.json().submissions;
            }).catch(SharedService.errorHandler);
    }

    getProjects(): Observable<any> {
        return this.http.get('/api/projects')
            .map((res: Response) => {
                return res.json().submissions;
            }).catch(SharedService.errorHandler);
    }

    createSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/create', pt)
            .map((res: Response) => res.json())
            .catch(SharedService.errorHandler);
    }

    saveSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/save', pt)
            .map((res: Response) => {
            })
            .catch(SharedService.errorHandler);
    }

    submitSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submissions/tmp/submit', pt)
            .map((res: Response) => res.json())
            .catch(SharedService.errorHandler);
    }

    directCreateOrUpdate(pt: any, create: boolean): Observable<any> {
        return this.http.post(`/api/submissions/origin/submit?create=${create}`, pt)
            .map((res: Response) => res.json())
            .catch(SharedService.errorHandler);
    }

    convert(file: File, format: string = ''): Observable<any> {
        let formData = new FormData();
        formData.append('op', 'CONVERT');
        formData.append('type', format);
        formData.append('file', file);

        return this.http.post('/raw/formsubmit', formData)
            .map((res: Response) => res.json())
            .catch(SharedService.errorHandler);
    }

    deleteSubmission(accno) {
        return this.http.del('/api/submissions/' + accno)
            .map((resp: Response) => resp.json())
            .catch(SharedService.errorHandler);
    }
}
import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

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

    getSubmission(accno: string, origin: boolean = false): Observable<any> {
        return this.http.get(`/api/submission/${accno}?origin=${origin}`)
            .map((res: Response) => res.json())
            .catch(SubmissionService.errorHandler);
    }

    getSubmittedSubmission(accno: string): Observable<any> {
        return this.getSubmission(accno, true);
    }

    getSubmissions(args: any = {}): Observable<any> {
        let urlParams = new UrlParams(args);
        return this.http.get('/api/submissions', urlParams.list)
            .map((res: Response) => {
                return res.json().submissions;
            }).catch(SubmissionService.errorHandler);
    }

    createSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submission/create', pt)
            .map((res: Response) => res.json())
            .catch(SubmissionService.errorHandler);
    }

    saveSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submission/save', pt)
            .map((res: Response) => {
            })
            .catch(SubmissionService.errorHandler);
    }

    editSubmission(accno: string): Observable<any> {
        return this.http.get(`/api/submission/edit/${accno}`)
            .map((res: Response) => res.json())
            .catch(SubmissionService.errorHandler);
    }

    submitSubmission(pt: any): Observable<any> {
        return this.http.post('/api/submission/submit', pt)
            .map((res: Response) => res.json())
            .catch(SubmissionService.errorHandler);
    }

    directCreateOrUpdate(pt: any, create: boolean): Observable<any> {
        return this.http.post(`/api/submission/direct?create=${create}`, pt)
            .map((res: Response) => res.json())
            .catch(SubmissionService.errorHandler);
    }

    convert(file: File, format: string = ''): Observable<any> {
        let formData = new FormData();
        formData.append('op', 'CONVERT');
        formData.append('type', format);
        formData.append('file', file);

        return this.http.post('/raw/formsubmit', formData)
            .map((res: Response) => res.json())
            .catch(SubmissionService.errorHandler);
    }

    deleteSubmission(accno) {
        return this.http.del('/api/submission/' + accno)
            .map((resp: Response) => resp.json())
            .catch(SubmissionService.errorHandler);
    }

    static errorHandler(error: any) {
        console.error(error);
        return Observable.throw(error);
    }
}
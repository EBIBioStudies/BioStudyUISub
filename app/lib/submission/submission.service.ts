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

    getSubmission(accno, origin: boolean = false): Observable<any> {
        return this.http.get(`/api/submission/${accno}?origin=${origin}`)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    getSubmittedSubmission(submission): Observable<any> {
        return this.getSubmission(submission, true);
    }

    getSubmissions(args: any = {}): Observable<any> {
        let urlParams = new UrlParams(args);
        return this.http.get('/api/submissions', urlParams.list)
            .map((res: Response) => {
                let data = res.json();
                return data.submissions;
            }).catch(SubmissionService.errorHandler);
    }

    createSubmission(pt): Observable<any> {
        return this.http.post('/api/submission/create', pt)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    saveSubmission(pt): Observable<any> {
        return this.http.post('/api/submission/save', pt)
            .map((res: Response) => {
                return {}; //empty response if OK
            }).catch(SubmissionService.errorHandler);
    }

    editSubmission(accno): Observable<any> {
        return this.http.get(`/api/submission/edit/${accno}`)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    submitSubmission(pt): Observable<any> {
        return this.http.post('/api/submission/submit', pt)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    formSubmit(file: File, format: string = ''): Observable<any> {
        let formData = new FormData();
        formData.append('op', 'CREATEUPDATE');
        formData.append('type', format);
        formData.append('file', file);

        return this.http.post('/raw/formsubmit', formData)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    deleteSubmission(accno) {
        return this.http.del('/api/submission/' + accno)
            .map((resp: Response) => {
                let data = resp.json();
                if (data.status === "OK") {
                    return data;
                } else {
                    return Observable.throw({status: 'Error', message: data.message || 'Server error'});
                }
            }).catch(SubmissionService.errorHandler);
    }

    static errorHandler(error: any) {
        let err = {
            status: error.status || 'Error',
            message: error.statusText || 'Server error'
        };
        if (error.json) {
            try {
                let jsonError = error.json();
                err.message = jsonError.message || err.message;
            } catch (e) {// ignore ?
                console.log(error);
            }
        }
        console.error(err);
        return Observable.throw(err);
    }
}
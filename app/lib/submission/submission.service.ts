import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class SubmissionService {

    constructor(@Inject(HttpClient) private http: HttpClient) {
    }

    getSubmission(accno, origin: boolean = false) {
        return this.http.get('/api/submission/' + accno /*{params: {origin: origin === true}}*/)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    getAllSubmissions(offset = -1, limit = -1, filter = '') {
        return this.http.get(`/api/submissions?offset=${offset}&limit=${limit}&filter=${filter}`)
            .map((res: Response) => {
                let data = res.json();
                return data.submissions;
            }).catch(SubmissionService.errorHandler);
    }

    createSubmission(pt) {
        return this.http.post('/api/submission/create', pt)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    saveSubmission(pt) {
        return this.http.post("/api/submission/save", pt)
            .map((res: Response) => {
                return {}; //empty response if OK
            }).catch(SubmissionService.errorHandler);
    }

    submitSubmission(pt) {
        return this.http.post("/api/submission/submit", pt)
            .map((res: Response) => {
                return res.json();
            }).catch(SubmissionService.errorHandler);
    }

    static errorHandler(error: any) {
        let err = {status: '', message: ''};
        try {
            let jsonError = error.json ? error.json() : error;
            err.status = (jsonError.status) ? jsonError.status : 'Error';
            err.message = (jsonError.message) ? jsonError.message : 'Server error';
        } catch (e) {
            // probably not a json
            err.status = error.status || 'Error';
            err.message = error.statusText || 'Server error';
        }
        console.error(err);
        return Observable.throw(err);
    }
}

/*
 export default class SubmissionService {
 constructor($http, $q, $log) {
 "ngInject";

 Object.assign(this, {
 getAllSubmissions(options) {
 return $http.get("/api/submissions", options)
 .then((response) => {
 return response.data.submissions;
 },
 (response) => {
 $log.error("getAllSubmissions() error: ", response);
 return $q.reject(response);
 })
 },

 getSubmission(accno, origin) {
 return $http.get("/api/submission/" + accno, {params: {origin: origin === true}})
 .then((response) => {
 return response.data;
 },
 (response) => {
 $log.error("getSubmission() error: ", response);
 return $q.reject(response);
 });
 },

 getSubmittedSubmission(submission) {
 return this.getSubmission(submission, true);
 },

 saveSubmission(submission) {
 return $http.post("/api/submission/save", submission)
 .then((response) => {
 return response.data;
 },
 (response) => {
 $log.error("saveSubmission() error: ", response);
 return $q.reject(response);
 });
 },



 createSubmission(submission) {
 return $http.post("/api/submission/create", submission)
 .then((response) => {
 return response.data;
 },
 (response) => {
 $log.error("createSubmission() error: ", response);
 return $q.reject(response);
 });
 },

 editSubmission(accno) {
 return $http.post("/api/submission/edit/" + accno)
 .then((response) => {
 return response.data;
 },
 (response) => {
 $log.error("editSubmission(accno=" + accno + ") error:", response);
 return $q.reject(response);
 });
 },

 deleteSubmission(accno) {
 return $http.delete("/api/submission/" + accno)
 .then((response) => {
 var data = response.data;
 if (data.status === "OK") {
 return data;
 } else {
 $log.error("deleteSubmission(accno=" + accno + ") error:", data);
 return $q.reject("delete error", data);
 }
 }, (response) => {
 $log.error("deleteSubmission() error: ", response);
 return $q.reject("delete error", {status: "FAILED", message: "Server error"});
 });
 }
 });
 }
 }*/

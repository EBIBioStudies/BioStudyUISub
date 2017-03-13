import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

export class SubmUploadResults {
    private __created: Date;
    private __filename: string;
    private __contentType: string;

    constructor() {
        this.__created = new Date();
        this.__filename = "file_name.json";
        this.__contentType = "text/json";
    }

    get failed(): boolean {
        return true;
    }

    get successful(): boolean {
        return false;
    }

    get inprogress(): boolean {
        return false;
    }

    get contentType(): string {
        return this.__contentType;
    }

    get created(): Date {
        return this.__created;
    }

    get filename(): string {
        return this.__filename;
    }
}


@Injectable()
export class SubmissionUploadService {

    constructor(@Inject(HttpClient) private http: HttpClient) {
    }

    lastResults(): Observable<SubmUploadResults> {
        return Observable.of(new SubmUploadResults());
    }
}
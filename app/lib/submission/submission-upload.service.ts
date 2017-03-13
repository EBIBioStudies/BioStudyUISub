import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';


const LOG = {
    "mapping": [],
    "log": {
        "level": "ERROR",
        "message": "CREATE submission(s) from json source",
        "subnodes": [
            {
                "level": "INFO",
                "message": "Processing 'json' data. Body size: 808"
            },
            {
                "level": "WARN",
                "message": "Charset isn't specified. Assuming default 'utf-8'"
            },
            {
                "level": "SUCCESS",
                "message": "Parsing JSON body",
                "subnodes": [
                    {
                        "level": "SUCCESS",
                        "message": "Procesing submission",
                        "subnodes": [
                            {
                                "level": "INFO",
                                "message": "Submission accession no: !{S-BSST}"
                            },
                            {
                                "level": "SUCCESS",
                                "message": "Processing section 'Study'",
                                "subnodes": [
                                    {
                                        "level": "SUCCESS",
                                        "message": "Processing section 'Author'"
                                    },
                                    {
                                        "level": "SUCCESS",
                                        "message": "Processing section 'Organization'"
                                    },
                                    {
                                        "level": "SUCCESS",
                                        "message": "Processing file reference"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "level": "ERROR",
                "message": "Internal server error"
            },
            {
                "level": "ERROR",
                "message": "Submit/Update operation failed. Rolling transaction back"
            }
        ]
    },
    "status": "FAIL"
};


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

    get log(): any {
        return LOG ? LOG.log : {};
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
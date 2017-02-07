import {Injectable, Inject} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';

@Injectable()
export class FileService {
    constructor(@Inject(HttpClient) private http: HttpClient,) {
    }

    getFiles(path: string = '/', depth: number = 1, showArchive: boolean = true): Observable<any> {
        return this.http.get(`/api/files/dir?showArchive=${showArchive}&depth=${depth}&path=${path}`)
            .map((res: Response) => res.json())
            .catch(FileService.errorHandler);
    }

    removeFile(fullPath): Observable<any> {
        return this.http.del("/api/files/delete?path=" + fullPath)
            .map((res: Response) => res.json())
            .catch(FileService.errorHandler);
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
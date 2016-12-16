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

    cutOffUserRoot(obj): void {
        if (!_.isObject(obj)) {
            return;
        }
        if (obj.path) {
            obj.path = obj.path.replace(/^(\/User\/)/, "");
        }
        _.forEach(obj, (item) => {
            this.cutOffUserRoot(item);
        });
    }

    getFiles(): Observable<any> {
        return this.http.get("/api/files/dir")
            .map((res: Response) => {
                let data = res.json();
                if (data.status === 'OK') {
                    if (data.files.length > 0) {
                        this.cutOffUserRoot(data.files[0].files);
                    }
                    return data.files;
                }
                return Observable.throw({status: 'Error', message: data.message || 'Server error'});
            })
            .catch(FileService.errorHandler);
    }

    removeFile(fileName): Observable<any> {
        return this.http.del("/api/files/delete?file=" + fileName)
            .map((res: Response) => {
                return res.json();
            })
            .catch(FileService.errorHandler);
    }

    static errorHandler(error: any) {
        let err = {status: '', message: ''};
        try {
            var jsonError = error.json ? error.json() : error;
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
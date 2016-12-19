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
        let err = {
            status: error.status || 'Error',
            message: error.statusText || 'Server error'
        };
        if (error.json) {
            try {
                let jsonError = error.json();
                err.message = jsonError.message || err.message;
            } catch(e) {// ignore ?
                console.log(error);
            }
        }
        console.error(err);
        return Observable.throw(err);
    }
}
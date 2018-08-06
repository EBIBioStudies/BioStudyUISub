import {Injectable} from '@angular/core';

import {HttpCustomClient} from '../http/http-custom-client.service'
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class FileService {
    subscriptions: Subscription[] = [];

    constructor(private http: HttpCustomClient) {}

    getUserDirs(): Observable<any> {
        return this.getFiles('/Groups', 1, false)
            .map(data => data.files)
            .map(files => _.map(files, (f) => ({name: f.name, path: '/Groups/' + f.name})))
            .map(files => [].concat([{name: 'Home', path: '/User'}], files))
    }

    getFiles(path: string = '/', depth: number = 1, showArchive: boolean = true): Observable<any> {
        return this.http.get(`/api/files?showArchive=${showArchive}&depth=${depth}&path=${path}`);
    }

    removeFile(fullPath): Observable<any> {
        return this.http.del(`/api/files?path=${encodeURIComponent(fullPath)}`);
    }

    getUserGroups(): Observable<any> {
        return this.http.get('/raw/groups')
            .map(groups => groups.map(g => ({name: g.name, path: '/Groups/' + g.name, id: g.groupId})))
            .map(paths => [].concat([{name: 'Home', path: '/User'}], paths))
    }
}
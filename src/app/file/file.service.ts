import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {PathInfo, UserGroup} from './file.model';

@Injectable()
export class FileService {

    constructor(private http: HttpClient) {
    }

    getUserDirs(): Observable<PathInfo[]> {
        return this.getUserGroups()
            .map(groups => groups.map(g => ({ame: g.name, path: '/Groups/' + g.name, type: 'DIR'})))
            .map(paths => [].concat([{name: 'Home', path: '/User', type: 'DIR'}], paths));
    }

    getFiles(path: string): Observable<PathInfo[]> {
        let params = new HttpParams();//.set('showArchives', showArchive + '');
        return this.http.get<PathInfo[]>(`/raw/files${path}`, {params});
    }

    removeFile(fullPath: string): Observable<any> {
        return this.http.delete(`/raw/files${fullPath}`);
    }

    getUserGroups(): Observable<UserGroup[]> {
        return this.http.get<UserGroup[]>('/raw/groups');
    }
}
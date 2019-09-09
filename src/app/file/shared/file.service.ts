import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PathInfo, UserGroup } from './file-rest.model';
import { map } from 'rxjs/operators';
import { HttpUploadClientService, UploadEvent } from './http-upload-client.service';

@Injectable()
export class FileService {
    constructor(private http: HttpClient, private httpUpload: HttpUploadClientService) {
    }

    getUserDirs(groups?: Observable<UserGroup[]>): Observable<PathInfo[]> {
        const userGroups = groups || this.getUserGroups();

        return userGroups.pipe(
            map((groupsByUser) => groupsByUser.map((group) => new PathInfo(group.name, '/groups/' + group.name, 'DIR'))),
            map(paths => ([] as PathInfo[]).concat([new PathInfo('Home', '/user', 'DIR')], paths))
        );
    }

    getFiles(fullPath: string): Observable<PathInfo[]> {
        return this.http.get<PathInfo[]>(`/raw/files${fullPath}`);
    }

    removeFile(fullPath: string): Observable<any> {
        return this.http.delete(`/raw/files${fullPath}`);
    }

    getUserGroups(): Observable<UserGroup[]> {
        return this.http.get<UserGroup[]>('/raw/groups');
    }

    upload(fullPath: string, files: File[]): Observable<UploadEvent> {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file, file.name);
        });

        return this.httpUpload.upload(`/raw/files${fullPath}`, formData);
    }
}

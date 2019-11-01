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
            map((groupsByUser) => groupsByUser.map((group) => new PathInfo(group.name, 'groups', 'DIR'))),
            map(paths => [new PathInfo('/', 'user', 'DIR'), ...paths])
        );
    }

    getFiles(fullPath: string): Observable<PathInfo[]> {
        return this.http.get<PathInfo[]>(`/api/files${fullPath}`);
    }

    removeFile(filePath: string, fileName: string): Observable<any> {
        return this.http.delete(`/api/files/${filePath}?fileName=${fileName}`);
    }

    getUserGroups(): Observable<UserGroup[]> {
        return this.http.get<UserGroup[]>('/api/groups');
    }

    download(filePath: string, fileName: string): Observable<any> {
        return this.http.get(`/api/files/${filePath}?fileName=${fileName}`, { responseType: 'blob' });
    }

    upload(fullPath: string, files: File[], keepFolders: boolean = true): Observable<UploadEvent> {
        const formData = new FormData();

        files.forEach((file: FullPathFile) => {
            // Keep file paths (folders) only if browser supports "webkitRelativePath".
            // If it doesn't, files are uploaded without keeping folder structure.
            if (String.isDefinedAndNotEmpty(file.webkitRelativePath) && keepFolders) {
                formData.append('files', file, file.webkitRelativePath);
            } else {
                formData.append('files', file, file.name);
            }
        });

        return this.httpUpload.upload(`/api/files${fullPath}`, formData);
    }
}

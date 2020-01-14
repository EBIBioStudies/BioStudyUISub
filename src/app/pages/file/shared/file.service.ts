import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PathInfo, UserGroup } from './file-rest.model';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { HttpUploadClientService, UploadEvent } from './http-upload-client.service';
import { LogService } from 'app/core/logger/log.service';
import { of, throwError } from 'rxjs';

@Injectable()
export class FileService {
    constructor(
        private http: HttpClient,
        private httpUpload: HttpUploadClientService,
        private logService: LogService
    ) {}

    download(filePath: string, fileName: string): Observable<any> {
        return this.http.get(`/api/files/${filePath}?fileName=${fileName}`, { responseType: 'blob' });
    }

    getFiles(fullPath: string): Observable<PathInfo[]> {
        return this.http.get<PathInfo[]>(`/api/files${fullPath}`);
    }

    getUserDirs(groups?: Observable<UserGroup[]>): Observable<PathInfo[]> {
        const userGroups = groups || this.getUserGroups();

        return userGroups.pipe(
            map((groupsByUser) => groupsByUser.map((group) => new PathInfo(group.name, 'groups', 'DIR'))),
            map(paths => [new PathInfo('/', 'user', 'DIR'), ...paths])
        );
    }

    getUserGroups(): Observable<UserGroup[]> {
        return this.http.get<UserGroup[]>('/api/groups');
    }

    removeFile(filePath: string, fileName: string): Observable<any> {
        return this.http.delete(`/api/files/${filePath}?fileName=${fileName}`);
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

        this.logService.upload('file-upload: start', ...files);

        return this.httpUpload.upload(`/api/files${fullPath}`, formData).pipe(
            catchError((error: HttpErrorResponse) => {
                this.logService.error('file-upload: error', error);

                return throwError(error);
            }),
            finalize(() => {
                this.logService.upload('file-upload: finish', ...files);
            })
        );
    }
}
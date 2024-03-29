import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';
import { PathInfo, UserGroup } from './file-rest.model';
import { HttpUploadClientService, UploadEvent } from './http-upload-client.service';

interface FullPathFile extends File {
  webkitRelativePath: string;
}

@Injectable()
export class FileService {
  constructor(private http: HttpClient, private httpUpload: HttpUploadClientService) {}

  download(filePath: string, fileName: string): Observable<any> {
    return this.http.get(`/api/files/${filePath}?fileName=${fileName}`, { responseType: 'blob' });
  }

  getFiles(fullPath: string): Observable<PathInfo[]> {
    return this.http.get<PathInfo[]>(`/api/files${fullPath}`);
  }

  getUserDir(): PathInfo {
    return new PathInfo('/', 'user', 'DIR');
  }

  getUserDirs(): Observable<PathInfo[]> {
    const userGroups: Observable<UserGroup[]> = this.getUserGroups();

    return userGroups.pipe(
      map((groupsByUser) => groupsByUser.map((group) => new PathInfo(group.name, 'groups', 'DIR'))),
      map((paths) => [this.getUserDir(), ...paths])
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
      if (isDefinedAndNotEmpty(file.webkitRelativePath) && keepFolders) {
        formData.append('files', file, file.webkitRelativePath);
      } else {
        formData.append('files', file, file.name);
      }
    });

    return this.httpUpload.upload(`/api/files${fullPath}`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  getFullPath(file: File): string {
    return (file as FullPathFile)?.webkitRelativePath;
  }
}

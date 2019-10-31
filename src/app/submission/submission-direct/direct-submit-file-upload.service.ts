import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from '../../file/shared/file.service';
import { Path } from '../../file/shared/path';
import { UploadEvent } from '../../file/shared/http-upload-client.service';

@Injectable()
export class DirectSubmitFileUploadService {
  private fileService: FileService;
  private path: Path = new Path('/user', '/');

  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  doUpload(file: File): Observable<UploadEvent> {
    const absolutePath = this.path.absolutePath();
    const uploadRequest = this.fileService.upload(absolutePath, [file], false);

    return uploadRequest;
  }
}

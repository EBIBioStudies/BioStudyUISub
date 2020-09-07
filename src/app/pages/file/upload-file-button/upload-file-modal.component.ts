import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Path } from '../shared/path';
import { FileUpload, FileUploadList } from '../shared/file-upload-list.service';

@Component({
  selector: 'st-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.css']
})
export class UploadFileModalComponent {
  absolutePath: string = '/user';
  files: File[] = [];
  fileToUploadName: string = '';
  isUploadEnabled: boolean = false;
  onClose: Subject<string> = new Subject();
  private upload?: FileUpload;

  constructor(private fileUploadList: FileUploadList, public bsModalRef: BsModalRef) {}

  get error(): string {
    return this.upload ? (this.upload.error || '') : '';
  }

  get isUploading(): boolean {
    return Boolean(this.upload && !this.upload.isFailed());
  }

  get uploadProgressValue(): number {
    if (this.upload) {
      if (this.upload.isFailed()) {
        return -1;
      }

      return this.upload.progress;
    }

    return 100;
  }

  hide(): void {
    this.bsModalRef.hide();
  }

  onCancelCloseClick(): void {
    if (this.upload) {
      this.upload.cancel();
    }

    this.hide();
  }

  onInputChange($event): void {
    const files: FileList = $event.target.files;
    const rawFiles: File[] = Array.from(files);
    const filesToUploadName: string[] = rawFiles.map((file) => file.name);

    this.fileToUploadName = filesToUploadName[0];
    this.isUploadEnabled = true;
    this.files = rawFiles;
  }

  onUploadClick(): void {
    this.uploadFile(this.files);
  }

  private uploadFile(files: File[]): void {
    const uploadPath: Path = new Path(this.absolutePath, '');

    this.upload = this.fileUploadList.upload(uploadPath, Array.from(files));
    this.isUploadEnabled = false;


    this.fileUploadList.uploadCompleted$.subscribe(() => {
      if (this.upload) {
        const fileName = this.upload.fileNames[0];
        this.onClose.next(fileName);
      }

      this.hide();
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Path } from './path';
import { FileService } from './file.service';
import { UploadErrorEvent, UploadEvent, UploadProgressEvent } from './http-upload-client.service';

enum UploadState {
  ERROR = 'error',
  SUCCESS = 'success',
  UPLOADING = 'uploading',
  CANCELLED = 'cancelled'
}

const CANCEL_UPLOAD_EVENT = new UploadEvent();

export class FileUpload {
  readonly fileNames: string[];
  readonly filePath: Path;
  finish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private errorTitle: string = '';
  private errorDetail: string = '';
  private percentage: number;
  private sb?: Subscription;
  private state: UploadState = UploadState.UPLOADING;
  private uploadEvent$: Subject<UploadEvent> = new Subject<UploadEvent>();

  constructor(path: Path, files: File[], fileService: FileService) {
    this.filePath = path;
    this.fileNames = files.map((f) => f.name);
    this.percentage = 0;

    const upload$: Observable<UploadEvent> = fileService.upload(path.absolutePath(), files, true);
    this.sb = upload$.subscribe((event: UploadEvent) => this.uploadEvent$.next(event));

    this.uploadEvent$.subscribe((event: UploadEvent) => {
      if (event.isProgress()) {
        this.percentage = (event as UploadProgressEvent).percentage;
        this.state = UploadState.UPLOADING;
      }

      if (event.isError()) {
        this.errorTitle = (event as UploadErrorEvent).title;
        this.errorDetail = (event as UploadErrorEvent).detail;
        this.state = UploadState.ERROR;
      }

      if (event.isSuccess()) {
        this.state = UploadState.SUCCESS;
      }

      if (event === CANCEL_UPLOAD_EVENT) {
        this.state = UploadState.CANCELLED;
      }

      if (this.isDone()) {
        this.finish$.next(true);
        this.finish$.complete();
        this.uploadEvent$.complete();
      }
    });
  }

  get progress(): number {
    return this.percentage;
  }

  get status(): string {
    return this.state;
  }

  get error(): { title: string; detail: string } {
    return { title: this.errorTitle, detail: this.errorDetail };
  }

  get absoluteFilePath(): string {
    return this.filePath.absolutePath();
  }

  cancel(): void {
    if (!this.isFinished()) {
      if (this.sb) {
        this.sb.unsubscribe();
      }

      this.sb = undefined;
      this.uploadEvent$.next(CANCEL_UPLOAD_EVENT);
    }
  }

  isCancelled(): boolean {
    return this.state === UploadState.CANCELLED;
  }

  isDone(): boolean {
    return this.state === UploadState.SUCCESS || this.isCancelled();
  }

  isFailed(): boolean {
    return this.state === UploadState.ERROR;
  }

  isFinished(): boolean {
    return this.isDone() || this.isFailed();
  }

  isUploading(): boolean {
    return this.state === UploadState.UPLOADING;
  }
}

@Injectable()
export class FileUploadList {
  activeUploadsChanged$: Subject<FileUpload[]> = new BehaviorSubject<FileUpload[]>([]);
  uploadCompleted$: Subject<string> = new Subject<string>();

  private uploads: FileUpload[] = [];

  constructor(private fileService: FileService) {}

  get activeUploads(): FileUpload[] {
    return this.uploads.filter((u) => !u.isDone());
  }

  remove(upload: FileUpload): void {
    const index = this.uploads.indexOf(upload);
    if (index > -1) {
      this.uploads.splice(index, 1);
      this.notifyActiveUploadsChanged();
    }
  }

  upload(path: Path, files: File[]): FileUpload {
    const upload = new FileUpload(path, files, this.fileService);

    this.uploads.push(upload);

    // do not subscribe uploadFinish$ directly here.
    // as cancellation of finish$ will cancel uploadFinish$ as well
    upload.finish$.pipe(map(() => upload.absoluteFilePath)).subscribe((fullPath) => {
      this.uploadCompleted$.next(fullPath);
      this.notifyActiveUploadsChanged();
    });

    this.notifyActiveUploadsChanged();

    return upload;
  }

  private notifyActiveUploadsChanged(): void {
    this.activeUploadsChanged$.next(this.activeUploads);
  }
}

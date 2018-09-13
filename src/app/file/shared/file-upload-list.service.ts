import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

import {Path} from './path';
import {FileService} from './file.service';
import {UploadErrorEvent, UploadEvent, UploadProgressEvent} from './http-upload-client.service';
import {catchError, map} from 'rxjs/operators';

enum UploadState {
    ERROR = 'error',
    SUCCESS = 'success',
    UPLOADING = 'uploading',
    CANCELLED = 'cancelled'
}

const CANCEL_UPLOAD_EVENT = new UploadEvent();

export class FileUpload {
    private state: UploadState = UploadState.UPLOADING;
    private percentage: number;
    private errorMessage?: string;

    private sb?: Subscription;
    private uploadEvent$: Subject<UploadEvent> = new Subject<UploadEvent>();

    finish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    readonly filePath: Path;
    readonly fileNames: string[];

    constructor(path: Path, files: File[], fileService: FileService) {
        console.log('files', files);
        this.filePath = path;
        this.fileNames = files.map(f => f.name);
        this.percentage = 0;

        let upload$: Observable<UploadEvent> =
            fileService.upload(path.absolutePath(), files).pipe(
                catchError((error: UploadErrorEvent) => {
                    console.log(error.message);
                    return Observable.of(error);
                })
            );

        this.uploadEvent$.subscribe((event: UploadEvent) => {
            if (event.isProgress()) {
                this.percentage = (<UploadProgressEvent>event).percentage;
                this.state = UploadState.UPLOADING;
            }
            if (event.isError()) {
                this.errorMessage = (<UploadErrorEvent>event).message;
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
        }, console.log);

        this.sb = upload$.subscribe(this.uploadEvent$);
    }

    get progress(): number {
        return this.percentage;
    }

    get status(): string {
        return this.state;
    }

    get error(): string | undefined {
        return this.errorMessage
    }

    get absoluteFilePath(): string {
        return this.filePath.absolutePath();
    }

    cancel(): void {
        if (!this.isFinished()) {
            this.sb!.unsubscribe();
            this.sb = undefined;
            this.uploadEvent$.next(CANCEL_UPLOAD_EVENT);
        }
    }

    isCancelled(): boolean {
        return this.state === UploadState.CANCELLED;
    }

    isFinished(): boolean {
        return this.isDone() || this.isFailed();
    }

    isDone(): boolean {
        return this.state === UploadState.SUCCESS || this.isCancelled();
    }

    isFailed(): boolean {
        return this.state === UploadState.ERROR;
    }
}

@Injectable()
export class FileUploadList {
    private uploads: FileUpload[] = [];

    uploadCompleted$: Subject<string> = new Subject<string>();
    activeUploadsChanged$: Subject<FileUpload[]> = new BehaviorSubject<FileUpload[]>([]);

    constructor(private fileService: FileService) {
    }

    get activeUploads(): FileUpload[] {
        return this.uploads.filter(u => !u.isDone());
    }

    upload(path: Path, files: File[]): FileUpload {
        let upload = new FileUpload(path, files, this.fileService);

        this.uploads.push(upload);

        // do not subscribe uploadFinish$ directly here.
        // as cancellation of finish$ will cancel uploadFinish$ as well
        upload.finish$.pipe(
            map(() => upload.absoluteFilePath)
        ).subscribe(fullPath => {
            this.uploadCompleted$.next(fullPath);
            this.notifyActiveUploadsChanged();
        });

        this.notifyActiveUploadsChanged();

        return upload;
    }

    remove(upload: FileUpload) {
        const index = this.uploads.indexOf(upload);
        if (index > -1) {
            this.uploads.splice(index, 1);
            this.notifyActiveUploadsChanged();
        }
    }

    private notifyActiveUploadsChanged() {
        this.activeUploadsChanged$.next(this.activeUploads)
    }
}
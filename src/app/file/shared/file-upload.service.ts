import {ErrorHandler, Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {HttpCustomClient} from 'app/http/http-custom-client.service'
import {Path} from './path';
import {ServerError} from '../../http';

const FILE_UPLOAD_URL = '/raw/fileUpload';

enum UploadState {
    ERROR = 'error',
    SUCCESS = 'success',
    UPLOADING = 'uploading',
    CANCELLED = 'cancelled'
}

class FileUploadStatus {
    constructor(public state: UploadState,
                public progress: number,
                public errorMessage: string | undefined = undefined) {
    }

    static ERROR = new FileUploadStatus(UploadState.ERROR, -1, 'Upload failure');

    static SUCCESS = new FileUploadStatus(UploadState.SUCCESS, 100);

    static uploading(progress: number): FileUploadStatus {
        return new FileUploadStatus(UploadState.UPLOADING, progress);
    }

    static cancelled(progress: number): FileUploadStatus {
        return new FileUploadStatus(UploadState.CANCELLED, progress);
    }
}

export class FileUpload {
    private state: UploadState = UploadState.UPLOADING;
    private fileNames: string[];
    private filePath: Path;

    private sb?: Subscription;
    private errorMessage?: string;
    private progressPercentage: number;

    private status$: Subject<FileUploadStatus> = new Subject<FileUploadStatus>();
    finish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(path: Path, files: File[], httpClient: HttpCustomClient, globalHandler: ErrorHandler) {
        console.log('files', files);
        this.filePath = path;
        this.fileNames = files.map(f => f.name);
        this.progressPercentage = 0;

        let upload = httpClient.upload(FILE_UPLOAD_URL, files, path.fullPath());

        let uploadStatus$ = upload
            .map((res) => {
                if (res.kind === 'progress') {
                    return FileUploadStatus.uploading(res.progress);
                }
                if (res.kind === 'response') {
                    return FileUploadStatus.SUCCESS;
                }
            })
            .catch((error) => {
                console.log(error);
                globalHandler.handleError(ServerError.fromResponse(error));
                return Observable.of(FileUploadStatus.ERROR);
            });

        this.status$.subscribe((fus) => {
            this.progressPercentage = fus.progress;
            this.state = fus.state;
            this.errorMessage = fus.errorMessage;
            if (this.isDone()) {
                this.finish$.next(true);
                this.finish$.complete();
                this.status$.complete();
            }
        }, console.log);

        this.sb = uploadStatus$.subscribe(this.status$);
    }

    get path(): Path {
        return this.filePath;
    }

    get progress(): number {
        return this.progressPercentage;
    }

    get status(): string {
        return this.state;
    }

    get files(): string[] {
        return this.fileNames.slice();
    }

    get error(): string | undefined {
        return this.errorMessage;
    }

    cancel(): void {
        if (!this.isFinished()) {
            this.sb!.unsubscribe();
            this.sb = undefined;
            this.status$.next(FileUploadStatus.cancelled(this.progressPercentage));
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
export class FileUploadService {
    private uploads: FileUpload[] = [];
    uploadCompleted$: Subject<string> = new Subject<string>();

    constructor(private http: HttpCustomClient, private globalHandler: ErrorHandler) {
    }

    /**
     * Retrieves only the upload requests that are still in progress.
     * @returns {FileUpload[]} Deep-cloned collection with incomplete requests filtered out.
     */
    activeUploads(): FileUpload[] {
        return this.uploads.filter(u => !u.isDone());
    }

    /**
     * Starts the request process for the selected files and keeps track of it.
     * NOTE: Multiple-file uploads are allowed. Each group of simultaneous uploads is bundled into one request.
     * @see {@link FileUpload}
     * @see {@link UploadService}
     * @param {Path} path - Path common to all files to be uploaded.
     * @param {File[]} files - Files to be uploaded.
     * @returns {FileUpload} Tracking object for the resulting upload request.
     */
    upload(path: Path, files: File[]): FileUpload {
        let upload = new FileUpload(path, files, this.http, this.globalHandler);

        this.uploads.push(upload);

        // do not subscribe uploadFinish$ directly here.
        // as cancellation of finish$ will cancel uploadFinish$ as well
        upload.finish$.map(() => upload.path.fullPath())
            .subscribe(fullPath => this.uploadCompleted$.next(fullPath));

        return upload;
    }

    /**
     * Removes a given upload request from the collection.
     * @param {FileUpload} upload - Group of simultaneously uploaded files.
     */
    remove(upload: FileUpload) {
        const index = this.uploads.indexOf(upload);
        if (index > -1) {
            this.uploads.splice(index, 1);
        }
    }
}
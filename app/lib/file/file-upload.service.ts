import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';
import {ProgressService} from '../http/progress.service';
import {Subject} from "../../jspm_packages/npm/rxjs@5.0.0-beta.12/Subject";

export class UploadEvent {
    progress: number;
    error: boolean = false;
    message: string;
    files: string[];

    static progress(fileNames: string[], progress: number) {
        let ev = new UploadEvent();
        ev.progress = progress;
        ev.files = fileNames;
        return ev;
    }

    static error(fileNames: string[], errorMsg: string) {
        let ev = new UploadEvent();
        ev.error = true;
        ev.message = errorMsg;
        ev.files = fileNames;
        return ev;
    }

    done(): boolean {
        return this.error || this.progress === 100;
    }
}

@Injectable()
export class FileUploadService {

    constructor(@Inject(HttpClient) private http: HttpClient,
                @Inject(ProgressService) private progress: ProgressService) {
    }

    uploadFiles(files: File[]): Observable<UploadEvent> {
        let subj = new Subject();

        let input = new FormData();
        let fileNames = [];
        for (let fi of files) {
            input.append('file', fi);
            fileNames.push(fi.name);
        }

        let sb = this.progress.uploadProgress.subscribe(
            e => {
                let progress = Math.ceil(100 * (e.loaded / e.total));
                subj.next(UploadEvent.progress(fileNames, progress))
            }
        );

        this.http
            .post('/api/fileUpload', input)
            .subscribe(res => {
                    sb.unsubscribe();
                },
                err => {
                    console.error(err);
                    sb.unsubscribe();
                    //TODO error message
                    subj.next(UploadEvent.error(fileNames, 'an error'));
                });
        return subj;
    }
}
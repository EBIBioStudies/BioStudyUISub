import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http-client'
import {Observable} from 'rxjs/Observable';
import {ProgressService} from '../http/progress.service';

@Injectable()
export class FileUploadService {

    constructor(@Inject(HttpClient) private http: HttpClient,
                @Inject(ProgressService) private progress: ProgressService) {
        console.debug("FileUploadService: progress=", progress);
    }

    uploadFiles(files: File[]) {
        let input = new FormData();
        for (let fi of files) {
            input.append('file', fi);
        }

        let sb = this.progress.uploadProgress.subscribe(e => console.log(100*(e.loaded/e.total)));
        console.log(sb);

        this.http
            .post('/api/fileUpload', input)
            .subscribe(res => {
                sb.unsubscribe();
                console.log(res);
            });
    }
}
import {Injectable, Inject} from '@angular/core';
import {BrowserXhr} from '@angular/http';
import {ProgressService} from './progress.service';

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {

    constructor(@Inject(ProgressService) private service: ProgressService) {
        super();
        console.debug("CustomBrowserXhr: progress=", this.service);
    }

    build(): any {
        console.debug("CustomBrowserXhr.Build: progress=", this.service);
        let xhr = super.build();
        xhr.onprogress = (event) => {
            this.service.downloadProgress.next(event);
        };

        xhr.upload.onprogress = (event) => {
            this.service.uploadProgress.next(event);
        };
        return <any>(xhr);
    }
}
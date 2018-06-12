import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';

import {FileUploadService} from './file-upload.service';

import * as _ from 'lodash';

@Component({
    selector: 'file-upload-badge',
    templateUrl: './file-upload-badge.component.html',
    styleUrls: ['./file-upload-badge.component.css']
})
export class FileUploadBadgeComponent {
    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    private _uploads = [];
    hasFailed: boolean;       //has any upload request failed?

    constructor(private uploader: FileUploadService) {}

    get count(): number {
        return this.uploads.length;
    }

    get uploads(): any[] {

        //Collection of upload requests.
        //NOTE: When multiple files are uploaded simultaneously, a single request is made.
        const uploadReqs = this.uploader.activeUploads();

        this.hasFailed = false;

        //Collection of upload operations, one per file (as opposed to multiple-file requests).
        const fileUploads = this.merge(_.flatMap(uploadReqs, (request) => {
            if (request.failed()) {
                this.hasFailed = this.hasFailed || request.failed();
            }

            return _.map(request.files, (file) => ({
                name: file,
                path: request.path,
                progress: request.failed() ? 'error' : request.progress + "%"
            }));
        }));

        return fileUploads;
    }

    merge(dest: any[]): any[] {
        if (this._uploads.length == 0) {
            this._uploads = dest;
            return dest;
        }
        let src = this._uploads;
        let i = 0, j = 0;
        while (i < src.length || j < dest.length) {
            if (i >= src.length && j < dest.length) {
                src.push(dest[j]);
                continue;
            }
            if (j >= dest.length && i < src.length) {
                src.splice(i, 1);
                continue;
            }
            let u1 = src[i];
            let u2 = dest[j];
            if (u1.name != u2.name) {
                src.splice(i, 1);
                i++;
                continue;
            }
            u1.progress = u2.progress;
            i++;
            j++;
        }
        return src;
    }

    onMenuItemClick(u) {
        this.select.emit({path: u.path, name: u.name});
    }
}
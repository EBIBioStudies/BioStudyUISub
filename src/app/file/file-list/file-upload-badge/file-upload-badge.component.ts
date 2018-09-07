import {Component, EventEmitter, Output} from '@angular/core';
import {FileUploadList} from '../../shared/file-upload-list.service';
import {Path} from '../../shared/path';

export class UploadBadgeItem {
    constructor(public readonly fileName: string,
                public readonly filePath: Path,
                public progress: string) {}
}

@Component({
    selector: 'file-upload-badge',
    templateUrl: './file-upload-badge.component.html',
    styleUrls: ['./file-upload-badge.component.css']
})
export class FileUploadBadgeComponent {
    @Output() select: EventEmitter<UploadBadgeItem> = new EventEmitter<UploadBadgeItem>();

    private uploadItems: UploadBadgeItem[] = [];
    hasFailed: boolean = false;       //has any upload request failed?

    constructor(private fileUploadList: FileUploadList) {
    }

    get count(): number {
        return this.uploadItems.length;
    }

    get uploads(): UploadBadgeItem[] {

        //Collection of upload requests.
        //NOTE: When multiple files are uploaded simultaneously, a single request is made.
        const activeFileUploads = this.fileUploadList.activeUploads();

        this.hasFailed = activeFileUploads.find(req => req.isFailed()) !== undefined;

        //Collection of upload operations, one per file (as opposed to multiple-file requests).
        return this.merge(activeFileUploads.map(fileUpload =>
            fileUpload.fileNames.map(fileName => ({
                fileName: fileName,
                filePath: fileUpload.filePath,
                progress: fileUpload.isFailed() ? 'error' : fileUpload.progress + '%'
            }))
        ).reduce((rv, v) => rv.concat(v), (<UploadBadgeItem[]>[])));
    }

    merge(dest: UploadBadgeItem[]): UploadBadgeItem[] {
        if (this.uploadItems.length == 0) {
            this.uploadItems = dest;
            return dest;
        }
        let src = this.uploadItems;
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
            if (u1.fileName != u2.fileName) {
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

    onMenuItemClick(uploadItem: UploadBadgeItem) {
        this.select.emit({...uploadItem});
    }
}
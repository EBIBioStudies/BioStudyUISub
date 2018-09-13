import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FileUploadList} from '../../shared/file-upload-list.service';
import {Path} from '../../shared/path';
import {Subscription} from 'rxjs';

export class UploadBadgeItem {
    constructor(public readonly fileName: string,
                public readonly filePath: Path,
                public progress: string) {
    }
}

@Component({
    selector: 'file-upload-badge',
    templateUrl: './file-upload-badge.component.html',
    styleUrls: ['./file-upload-badge.component.css']
})
export class FileUploadBadgeComponent implements OnDestroy {
    @Output() select: EventEmitter<UploadBadgeItem> = new EventEmitter<UploadBadgeItem>();

    private sb?: Subscription;
    private uploadItems: UploadBadgeItem[] = [];
    hasFailedUploads: boolean = false;       //has any upload request failed?

    constructor(fileUploadList: FileUploadList) {
        this.sb = fileUploadList.activeUploadsChanged$.subscribe(activeUploads => {

            this.hasFailedUploads = activeUploads.find(req => req.isFailed()) !== undefined;

            //Collection of upload operations, one per file (as opposed to multiple-file requests).
            return this.merge(
                activeUploads.map(fileUpload =>
                    fileUpload.fileNames.map(fileName => ({
                        fileName: fileName,
                        filePath: fileUpload.filePath,
                        progress: fileUpload.isFailed() ? 'error' : fileUpload.progress + '%'
                    }))
                ).reduce((rv, v) => rv.concat(v), (<UploadBadgeItem[]>[])));
        })
    }

    get count(): number {
        return this.uploadItems.length;
    }

    get uploads(): UploadBadgeItem[] {
        return this.uploadItems;
    }

    merge(dest: UploadBadgeItem[]): UploadBadgeItem[] {
        console.log('merge', dest)
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
        console.log(this.uploadItems.length);
        return src;
    }

    onMenuItemClick(uploadItem: UploadBadgeItem) {
        this.select.emit({...uploadItem});
    }

    ngOnDestroy(): void {
        this.sb!.unsubscribe();
    }
}
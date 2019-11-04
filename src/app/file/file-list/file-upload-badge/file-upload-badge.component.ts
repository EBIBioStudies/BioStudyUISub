import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FileUploadList } from '../../shared/file-upload-list.service';
import { Path } from '../../shared/path';
import { Subscription } from 'rxjs';

export interface UploadBadgeItem {
    fileName: string;
    filePath: Path;
    progress: string;
}

@Component({
    selector: 'st-file-upload-badge',
    templateUrl: './file-upload-badge.component.html',
    styleUrls: ['./file-upload-badge.component.css']
})
export class FileUploadBadgeComponent implements OnDestroy {
    @Output() select: EventEmitter<UploadBadgeItem> = new EventEmitter<UploadBadgeItem>();

    private sb?: Subscription;
    private uploadItems: UploadBadgeItem[] = [];
    hasFailedUploads: boolean = false;

    constructor(fileUploadList: FileUploadList) {
        this.sb = fileUploadList.activeUploadsChanged$.subscribe(activeUploads => {

            this.hasFailedUploads = activeUploads.find(req => req.isFailed()) !== undefined;

            this.uploadItems =
                activeUploads.map(fileUpload =>
                    fileUpload.fileNames.map(fileName => ({
                        fileName: fileName,
                        filePath: fileUpload.filePath,
                        progress: fileUpload.isFailed() ? 'error' : fileUpload.progress + '%'
                    }))
                ).reduce((rv, v) => rv.concat(v), (<UploadBadgeItem[]>[]));
        });
    }

    get count(): number {
        return this.uploadItems.length;
    }

    get uploads(): UploadBadgeItem[] {
        return this.uploadItems;
    }

    onMenuItemClick(uploadItem: UploadBadgeItem) {
        this.select.emit({...uploadItem});
    }

    ngOnDestroy(): void {
        this.sb!.unsubscribe();
    }
}

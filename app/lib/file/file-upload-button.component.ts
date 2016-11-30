import {Component, Inject, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'file-upload-button',
    template: `
    <input type="file" 
           id="fileInput" 
           name="fileInput" 
           title="Upload Files" 
           (change)="onFileChange($event)"
           style="display:none"
           multiple
           #inputFile/>
    <button type="button"
            class="btn btn-default btn-xs"
            (click)="inputFile.click()">
            Upload Files
    </button>
`
})
export class FileUploadButtonComponent implements OnInit {
    @Output() onUpload: EventEmitter = new EventEmitter();

    constructor(@Inject(FileUploadService) private uploader: FileUploadService) {
    }

    onFileChange(event) {
        let files = event.target.files;
        console.debug("Files to upload:", files);
        let subscr = this.uploader.uploadFiles(files).subscribe(ev => {
            this.onUpload.emit(ev);
            if (ev.done()) {
                subscr.unsubscribe();
            }
        });
    }
}
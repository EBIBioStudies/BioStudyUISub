import {Component, Inject, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';

@Component({
    selector: 'file-upload-button',
    template: `
    <input type="file" 
           id="fileInput" 
           name="fileInput" 
           title="Upload Files" 
           (change)="onInputChange($event)"
           style="display:none"
           multiple
           #inputFile/>
    <button type="button"
            class="btn btn-default btn-xs"
            (click)="inputFile.value = '';inputFile.click()">
            Upload Files
    </button>
`
})
export class FileUploadButtonComponent implements OnInit {
    @Output() onUpload: EventEmitter = new EventEmitter();
    @Input() path: string;

    constructor(@Inject(FileUploadService) private uploader: FileUploadService) {
    }

    onInputChange(event) {
        let files = event.target.files;
        console.debug("Files to upload:", files);
        let upload = this.uploader.upload(this.path, files);
        this.onUpload.emit(upload);
    }
}
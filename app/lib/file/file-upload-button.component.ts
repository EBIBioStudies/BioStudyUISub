import {Component, Inject, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';

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
    //@Output() change = new EventEmitter<any>();

    constructor(@Inject(FileUploadService) private uploader: FileUploadService) {
    }

    onFileChange(event) {

        let files = event.target.files;
        console.log("Files to upload:", files);
        this.uploader.uploadFiles(files);
        // this.change.emit(files);
    }

}
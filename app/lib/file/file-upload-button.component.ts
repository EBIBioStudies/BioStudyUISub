import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import {FileUploadService, FileUpload} from './file-upload.service';
import {Path} from './path';

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
export class FileUploadButtonComponent {
    @Output() onUpload: EventEmitter<FileUpload> = new EventEmitter<FileUpload>();
    @Input() path: Path;

    constructor(@Inject(FileUploadService) private uploader: FileUploadService) {
    }

    onInputChange(event) {
        let files = event.target.files;
        console.debug("Files to upload:", files);
        let upload = this.uploader.upload(this.path, files);
        this.onUpload.emit(upload);
    }
}
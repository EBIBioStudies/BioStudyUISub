import {Component, EventEmitter, Output, Input} from '@angular/core';

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
            {{title}}
    </button>
`
})
export class FileUploadButtonComponent {
    @Output() select: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Input() title: string = 'Upload';

    onInputChange(event) {
        let files = event.target.files;
        this.select.emit(files);
    }
}
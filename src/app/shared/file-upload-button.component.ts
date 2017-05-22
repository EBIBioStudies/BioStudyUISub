import {
    Component,
    EventEmitter,
    Output,
    Input
} from '@angular/core';

@Component({
    selector: 'file-upload-button',
    template: `
    <input type="file" 
           id="fileInput" 
           name="fileInput"  
           (change)="onInputChange($event)"
           style="display:none"
           [multiple]="multiple"
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
    @Input() multiple: boolean = false;

    onInputChange(event) {
        let files = event.target.files;
        this.select.emit(files);
    }
}
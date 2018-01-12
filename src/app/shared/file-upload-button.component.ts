import {
    Component,
    EventEmitter,
    Output,
    Input, ViewChild, ElementRef
} from '@angular/core';

@Component({
    selector: 'file-upload-button',
    template: `
    <input type="file" 
           id="fileInput" 
           name="fileInput"  
           (change)="onInputChange($event)"
           style="display: none"
           [multiple]="multiple"
           #inputFile/>
    <button type="button"
            class="btn btn-primary btn-sm"
            (click)="onButtonClick($event)">
            {{title}}
    </button>
`
})
export class FileUploadButtonComponent {
    @Output() select: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Input() title: string = 'Browse...';
    @Input() multiple: boolean = false;

    @ViewChild('inputFile')
    private inputEl: ElementRef;

    onInputChange(event) {
        this.select.emit(event.target.files);
    }

    //Makes sure every subsequent selection triggers a "select" event even if the file selected is the same.
    onButtonClick(event) {
        this.inputEl.nativeElement.value = '';
        this.inputEl.nativeElement.click();
    }
}
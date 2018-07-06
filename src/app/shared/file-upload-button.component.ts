import {
    Component,
    EventEmitter,
    Output,
    Input, ViewChild, ElementRef
} from '@angular/core';

@Component({
    selector: 'file-upload-button',
    template: `
    <input class="hidden" type="file" 
           id="fileInput" 
           name="fileInput"  
           (change)="onInputChange($event)"
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
    public isDirSupport: boolean = false;

    @Output() select: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Input() title: string = 'Browse...';
    @Input() multiple: boolean = false;
    @Input() isResetOnClick: boolean = true;
    @Input() isDirOnly: boolean = false;

    @ViewChild('inputFile')
    private inputEl: ElementRef;

    ngOnInit() {
        this.isDirSupport = 'webkitdirectory' in this.inputEl.nativeElement;
    }

    ngOnChanges() {
        this.inputEl.nativeElement.webkitdirectory = this.isDirSupport && this.isDirOnly;
    }

    onInputChange(event) {
        this.select.emit(event.target.files);
    }

    //Makes sure every subsequent selection triggers a "select" event even if the file selected is the same.
    onButtonClick(event) {
        if (this.isResetOnClick) {
            this.inputEl.nativeElement.value = '';
        }
        this.inputEl.nativeElement.click();
    }
}
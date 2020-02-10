import {
  Component,
  EventEmitter,
  Output,
  Input, ViewChild, ElementRef, OnInit, OnChanges
} from '@angular/core';

@Component({
  selector: 'st-file-upload-button',
  template: `
  <input
    id="files-input"
    class="hidden"
    name="files-input"
    type="file"
    (change)="onInputChange($event)"
    [multiple]="multiple"
    allowdirs
    #inputFile
    directory
    webkitdirectory
  />
  <button type="button"
      class="btn btn-primary btn-sm"
      (click)="onButtonClick()">
      {{title}}
  </button>
`
})
export class FileUploadButtonComponent implements OnInit, OnChanges {
  @Input() isDirOnly: boolean = false;
  isDirSupport: boolean = false;
  @Input() isResetOnClick: boolean = true;
  @Input() multiple: boolean = false;
  @Output() select: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Input() title: string = 'Upload Files';

  @ViewChild('inputFile', { static: true })
  private inputEl?: ElementRef;

  ngOnChanges() {
    this.inputEl!.nativeElement.webkitdirectory = this.isDirSupport && this.isDirOnly;
  }

  ngOnInit() {
    this.isDirSupport = 'webkitdirectory' in this.inputEl!.nativeElement;
  }

  // Makes sure every subsequent selection triggers a "select" event even if the file selected is the same.
  onButtonClick() {
    if (this.isResetOnClick) {
      this.inputEl!.nativeElement.value = '';
    }
    this.inputEl!.nativeElement.click();
  }

  onInputChange($event) {
    this.select.emit($event.target.files);
  }
}

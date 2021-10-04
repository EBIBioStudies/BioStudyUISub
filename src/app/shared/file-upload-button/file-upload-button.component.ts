import { Component, EventEmitter, Output, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'st-file-upload-button',
  templateUrl: './file-upload-button.component.html'
})
export class FileUploadButtonComponent implements OnChanges {
  hasDirSupport: boolean = false;
  @Input() isDirOnly: boolean = false;
  @Input() isResetOnClick: boolean = true;
  @Input() multiple: boolean = false;
  @Output() fileUploadSelect: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Input() title: string = 'Upload Files';

  @ViewChild('inputFile', { static: true })
  private inputEl!: ElementRef;

  ngOnChanges(): void {
    this.hasDirSupport = 'webkitdirectory' in this.inputEl.nativeElement;
    this.inputEl.nativeElement.webkitdirectory = this.hasDirSupport && this.isDirOnly;
  }

  // Makes sure every subsequent selection triggers a "select" event even if the file selected is the same.
  onButtonClick(): void {
    if (this.isResetOnClick) {
      this.inputEl.nativeElement.value = '';
    }
    this.inputEl.nativeElement.click();
  }

  onInputChange($event): void {
    this.fileUploadSelect.emit($event.target.files);
  }

  get id(): string {
    return this.isDirOnly ? 'folder-input' : 'file-input';
  }

  get ariaLabel(): string {
    return this.isDirOnly ? 'Upload folder' : 'Upload file';
  }
}

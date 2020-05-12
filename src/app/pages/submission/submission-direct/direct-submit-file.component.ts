import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'st-direct-submit-file',
  templateUrl: './direct-submit-file.component.html',
  styleUrls: ['./direct-submit-file.component.css']
})
export class DirectSubmitFileComponent {
  @Input() accno;
  @Input() error;
  @Input() errorLog;
  @Input() file;
  @Output() fileClick = new EventEmitter<object>();
  @Input() hasSubmitFailed;
  @Input() hasSubmitPassed;
  @Input() isPending;
  @Input() isSubmitting;
  @Input() project;
  @Input() releaseDate;
  @Input() submitType;

  onFileClick(event: Event, hasSubmitFailed: boolean, accno: string) {
    this.fileClick.emit({ event, hasSubmitFailed, accno });
  }
}

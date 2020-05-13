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
  @Input() fileName;
  @Input() hasSubmitFailed;
  @Input() hasSubmitPassed;
  @Input() isPending;
  @Input() isStudy: boolean = false;
  @Output() isStudyChange = new EventEmitter<object>();
  @Input() isSubmitting;
  @Input() project;
  @Input() releaseDate;
  @Input() submitType;

  handleOnFileClick(event: Event, hasSubmitFailed: boolean, accno: string) {
    this.fileClick.emit({ event, hasSubmitFailed, accno });
  }

  handleOnIsStudyChange(isStudy: boolean, fileName: string) {
    this.isStudy = isStudy;
    this.isStudyChange.emit({ fileName, isStudy});
  }
}

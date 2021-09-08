import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'st-direct-submit-file',
  templateUrl: './direct-submit-file.component.html',
  styleUrls: ['./direct-submit-file.component.scss']
})
export class DirectSubmitFileComponent {
  @Input() accno;
  @Input() error;
  @Input() errorLog;
  @Input() file;
  @Input() fileName;
  @Input() hasSubmitFailed;
  @Input() hasSubmitPassed;
  @Input() isPending;
  @Input() isStudy: boolean = false;
  @Output() isStudyChange = new EventEmitter<object>();
  @Input() isSubmitting;
  @Input() project;

  handleOnIsStudyChange(isStudy: boolean, fileName: string): void {
    this.isStudy = isStudy;
    this.isStudyChange.emit({ fileName, isStudy });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

export const fileActionMap = {
  SET_AS_STUDY_ACTION: 'set-as-study',
  DELETE_FILE: 'delete-file'
};

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
  @Output() fileChange = new EventEmitter<object>();
  @Input() isSubmitting;
  @Input() project;
  @Input() showIsStudyOption: boolean = false;

  handleOnIsStudyChange(isStudy: boolean, fileName: string): void {
    this.isStudy = isStudy;
    this.fileChange.emit({ fileName, isStudy, action: fileActionMap.SET_AS_STUDY_ACTION });
  }

  handleOnDeleteFile(isStudy: boolean, fileName: string): void {
    this.fileChange.emit({ fileName, isStudy, action: fileActionMap.DELETE_FILE });
  }

  get id(): string {
    return this.fileName.toLowerCase().replace(/\s/g, '');
  }
}

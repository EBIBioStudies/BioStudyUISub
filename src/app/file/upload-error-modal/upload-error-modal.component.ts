import { Component, Input } from '@angular/core';
import { ServerError } from 'app/shared/server-error.handler';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-upload-error-modal',
  templateUrl: './upload-error-modal.component.html'
})
export class UploadErrorModalComponent {
  defaultErrorMessage = ServerError.defaultErrorMessage;
  @Input() errorDetail = '';

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  onCancelCloseClick(): void {
    this.hide();
  }
}

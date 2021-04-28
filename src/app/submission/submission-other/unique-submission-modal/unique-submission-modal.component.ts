import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-unique-submission-modal',
  templateUrl: './unique-submission-modal.component.html'
})
export class UniqueSubmissionModalComponent {
  @Input() similarSubmissions = [];

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  onCancelCloseClick(): void {
    this.hide();
  }
}

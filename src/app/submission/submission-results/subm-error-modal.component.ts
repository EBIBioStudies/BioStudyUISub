import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SubmissionService } from '../submission-shared/submission.service';

/**
 * UI component for the modal being rendered with a given study's submission results.
 */
@Component({
  selector: 'st-subm-error',
  templateUrl: './subm-error-modal.component.html'
})
export class SubmErrorModalComponent {
  collapsedLog?: boolean = false;
  log?: LogDetail;

  private modalRef: BsModalRef;

  constructor(modalRef: BsModalRef) {
    this.modalRef = modalRef;
  }

  get errorMessage(): string {
    return this.hasLog ? SubmissionService.deepestError(this.log!!) : 'Unknown error';
  }

  get hasLog(): boolean {
    return this.log !== undefined;
  }

  hideModal(): void {
    this.modalRef.hide();
  }

  /**
   * Formats the response's log section as a URI string.
   * @returns Serialised contents of the log section.
   */
  toLogURI(): string {
    return encodeURIComponent(JSON.stringify(this.log));
  }
}

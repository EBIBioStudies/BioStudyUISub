import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { SubmitLog, SubmissionService } from '../submission-shared/submission.service';

/**
 * UI component for the modal being rendered with a given study's submission results.
 */
@Component({
  selector: 'st-subm-results',
  templateUrl: './subm-results-modal.component.html'
})
export class SubmResultsModalComponent {
  collapsedLog?: boolean = false;
  isSuccess: boolean = true;
  log?: SubmitLog;

  private modalRef: BsModalRef;
  private router: Router;

  constructor(modalRef: BsModalRef, router: Router) {
    this.modalRef = modalRef;
    this.router = router;
  }

  get errorMessage() {
    return this.hasLog ? SubmissionService.deepestError(this.log!!) : 'Unknown error';
  }

  get hasLog(): boolean {
    return this.log !== undefined;
  }

  get isError(): boolean {
    return !this.isSuccess;
  }

  goToSubmissions() {
    this.hideModal();
    this.router.navigateByUrl('/submissions');
  }

  hideModal() {
    this.modalRef.hide();
  }

  /**
   * Formats the response's log section as a URI string.
   * @returns {string} Serialised contents of the log section.
   */
  toLogURI(): string {
    return encodeURIComponent(JSON.stringify(this.log));
  }
}

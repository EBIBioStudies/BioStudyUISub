import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { SubmissionStatus } from 'app/pages/submission/submission-shared/submission.status';

@Component({
  selector: 'st-status-cell',
  template: `
    <div class="d-flex align-items-center">
      <span *ngIf="shouldShowAccno || isResubmitting">
        {{submissionAccno}}
        <i *ngIf="isResubmitting" class="spinner-border spinner-border-sm status-spinner"></i>
      </span>
      <h5 class="d-flex m-0">
        <span *ngIf="isProcessingSubmission && !this.isResubmitting" class="badge badge-primary">
          {{processingDisplayName}}
          <i class="spinner-border spinner-border-sm status-spinner"></i>
        </span>
      </h5>
    </div>
  `,
})
export class StatusCellComponent implements AgRendererComponent {
  rowData: any;

  get submissionAccno(): boolean {
    return this.rowData.accno;
  }

  get shouldShowAccno(): boolean {
    return this.rowData !== undefined && !this.isProcessingSubmission;
  }

  get isProcessingSubmission(): boolean {
    return this.rowData !== undefined && this.rowData.isProcessing;
  }

  get processingDisplayName(): string {
    return SubmissionStatus.PROCESSING.displayValue;
  }

  get isResubmitting(): boolean {
    return this.rowData !== undefined && this.rowData.version > 1 && this.isProcessingSubmission;
  }

  agInit(params: any): void {
    this.rowData = params.data;
  }

  refresh(): boolean {
    return false;
  }
}

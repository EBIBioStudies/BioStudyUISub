import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { SubmissionStatus } from 'app/pages/submission/submission-shared/submission.status';

@Component({
  selector: 'st-status-cell',
  template: `
    <div>
      {{shouldShowAccno ? submissionAccno : ''}}
      <span *ngIf="isProcessingSubmission" class="badge badge-status badge-primary">
        {{processingDisplayName}}
        <span class="spinner-border spinner-border-sm badge-status-spinner"></span>
      </span>
    </div>
  `,
  styleUrls: ['./status-cell.component.css']
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

  agInit(params: any): void {
    this.rowData = params.data;
  }

  refresh(): boolean {
    return false;
  }
}

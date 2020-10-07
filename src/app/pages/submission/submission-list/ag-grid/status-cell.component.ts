import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { SubmissionStatus } from 'app/pages/submission/submission-shared/submission.status';

@Component({
  selector: 'st-status-cell',
  template: `
    <div>
      <span class="flex-center" *ngIf="shouldShowAccno || isResubmitting">
        {{submissionAccno}}
        <i *ngIf="isResubmitting" class="spinner-border spinner-border-sm status-spinner"></i>
      </span>
      <span *ngIf="isProcessingSubmission && !this.isResubmitting" class="badge flex-center badge-primary">
        {{processingDisplayName}}
        <i class="spinner-border spinner-border-sm status-spinner"></i>
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

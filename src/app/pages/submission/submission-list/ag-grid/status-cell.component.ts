import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { SubmissionStatus } from 'app/pages/submission/submission-shared/submission.status';

@Component({
  selector: 'st-status-cell',
  template: `
    <span class="badge" [ngClass]="{'badge-success': isProcessed, 'badge-primary': !isProcessed }">
      {{value}}
    </span>
  `,
  styleUrls: ['./status-cell.component.css']
})
export class StatusCellComponent implements AgRendererComponent {
  isProcessed: boolean = false;
  value?: string;

  agInit(params: any): void {
    const status: string = params.value;

    this.isProcessed = status === SubmissionStatus.PROCESSED.name;
    this.value = this.isProcessed ? SubmissionStatus.PROCESSED.displayValue : SubmissionStatus.PROCESSING.displayValue;
  }

  refresh(): boolean {
    return false;
  }
}

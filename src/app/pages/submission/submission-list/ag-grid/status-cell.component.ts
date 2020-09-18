import { isDefinedAndNotEmpty } from 'app/utils';
import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { SubmissionStatus } from 'app/pages/submission/submission-shared/submission.status';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'st-status-cell',
  template: `
    <div>
      {{accno}}
      <span *ngIf="shouldDisplayBadge" class="badge badge-primary">
        {{displayStatus}}
      </span>
    </div>
  `,
  styleUrls: ['./status-cell.component.css']
})
export class StatusCellComponent implements AgRendererComponent {
  accno?: string;
  displayStatus?: string = '';
  isProcessed: boolean = false;

  agInit(params: any): void {
    const [accno, status] = params.value.split(':');
    this.isProcessed = status === SubmissionStatus.PROCESSED.name;
    this.accno = this.isProcessed ? accno : '';

    if (isDefinedAndNotEmpty(status)) {
      this.displayStatus = this.isProcessed
        ? SubmissionStatus.PROCESSED.displayValue
        : SubmissionStatus.PROCESSING.displayValue;
    }
  }

  get shouldDisplayBadge(): boolean {
    return !this.isProcessed && isDefinedAndNotEmpty(this.displayStatus);
  }

  refresh(): boolean {
    return false;
  }
}

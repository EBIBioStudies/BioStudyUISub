import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'st-status-cell',
  template: '<span class="badge status-badge">{{value}}</span>',
  styleUrls: ['./status-cell.component.css']
})
export class StatusCellComponent implements AgRendererComponent {
  value?: string = 'Pending';
  valueToDisplayMap: object = {
    PROCESSING: 'Submitting',
    PROCESSED: 'Submitted'
  };

  agInit(params: any): void {
    this.value = this.valueToDisplayMap[params.value];
  }

  refresh(): boolean {
    return false;
  }
}

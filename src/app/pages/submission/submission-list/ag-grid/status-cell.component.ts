import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'st-status-cell',
  template: '<span class="badge status-badge">{{value}}</span>',
  styleUrls: ['./status-cell.component.css']
})
export class StatusCellComponent implements AgRendererComponent {
  value?: string;

  agInit(params: any): void {
    this.value = params.value;
  }

  refresh(): boolean {
    return false;
  }
}

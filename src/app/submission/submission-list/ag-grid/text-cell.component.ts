import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'st-text-cell',
  template: `<span class="{{ classes }}">{{ text }}</span>`,
  styleUrls: ['./text-cell.component.css']
})
export class TextCellComponent implements AgRendererComponent {
  classes: string = '';
  rowData: any;
  text: string = '';

  get isProcessingSubmission(): boolean {
    return this.rowData !== undefined && this.rowData.isProcessing;
  }

  agInit(params: any): void {
    this.text = params.value;
    this.rowData = params.data;
    this.classes = this.isProcessingSubmission ? 'text-cell-disable' : '';
  }

  refresh(): boolean {
    return false;
  }
}

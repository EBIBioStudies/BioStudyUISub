import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'st-date-cell',
  template: `
    <span class="{{ classes }}">
      {{ value === undefined ? '&mdash;' : (value | date: appConfig.dateListFormat) }}
    </span>
  `,
  styleUrls: ['./date-cell.component.css']
})
export class DateCellComponent implements AgRendererComponent {
  classes: string = '';
  rowData: any;
  value?: Date;

  /**
   * Exposes app's configuration to the template.
   * @param appConfig - Global configuration object with app-wide settings.
   */
  constructor(public appConfig: AppConfig) {}

  get isProcessingSubmission(): boolean {
    return this.rowData !== undefined && this.rowData.isProcessing;
  }

  agInit(params: any): void {
    this.rowData = params.data;
    this.value = this.asDate(params.value);
    this.classes = this.isProcessingSubmission ? 'data-cell-disable' : '';
  }

  /**
   * Mandatory - Get the cell to refresh.
   * @see {@link https://www.ag-grid.com/javascript-grid-cell-editor/}
   * @returns By returning false, the grid will remove the component from the DOM and create
   * a new component in it's place with the new values.
   */
  refresh(): boolean {
    return false;
  }

  /**
   * Formats date string into a JavaScript Date object.
   * @param date Date string to be formatted
   * @returns Equivalent JavaScript Date object.
   */
  private asDate(date: string): Date | undefined {
    if (date === undefined || date === null || date.length === 0) {
      return undefined;
    }

    return new Date(date);
  }
}

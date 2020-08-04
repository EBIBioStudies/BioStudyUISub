import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'st-date-cell',
  template: `{{ value === undefined ? '&mdash;' : value | date: appConfig.dateListFormat }}`
})
export class DateCellComponent implements AgRendererComponent {
  value?: Date;

  /**
   * Exposes app's configuration to the template.
   * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
   */
  constructor(public appConfig: AppConfig) {}

  agInit(params: any): void {
    this.value = this.asDate(params.value);
  }

  /**
   * Mandatory - Get the cell to refresh.
   * @see {@link https://www.ag-grid.com/javascript-grid-cell-editor/}
   * @returns {boolean} By returning false, the grid will remove the component from the DOM and create
   * a new component in it's place with the new values.
   */
  refresh(): boolean {
    return false;
  }

  /**
   * Formats date string into a JavaScript Date object.
   * @param {string} date Date string to be formatted
   * @returns {Date} Equivalent JavaScript Date object.
   */
  private asDate(date: string): Date | undefined {
    if (date === undefined || date === null || date.length === 0) {
      return undefined;
    }

    return new Date(date);
  }
}

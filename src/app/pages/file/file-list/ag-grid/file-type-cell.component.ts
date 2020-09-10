import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'st-file-type-cell',
  template: `
    <div class="text-center text-primary">
      <i class="fa" [ngClass]="{'fa-folder' : ftype === 'DIR'}"></i>
    </div>
  `
})
export class FileTypeCellComponent implements AgRendererComponent {
  ftype?: string;

  agInit(params: any): void {
    this.ftype = params.value;
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
}

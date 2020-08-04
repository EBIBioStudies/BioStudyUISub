import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'st-action-buttons-cell',
  template: `
    <button *ngIf="rowData" type="button" class="btn btn-primary btn-xs btn-flat"
        (click)="onEditSubmission()"
        tooltip="Edit this submission"
        container="body">
      <i class="fas fa-pencil-alt fa-fw"></i>
    </button>
    <button *ngIf="rowData && rowData.isDeletable" type="button" class="btn btn-danger btn-xs btn-flat"
        [disabled]="isBusy"
        (click)="onDeleteSubmission()"
        tooltip="Delete this submission"
        container="body">
      <i *ngIf="!isBusy" class="fas fa-trash-alt fa-fw"></i>
      <i *ngIf="isBusy" class="fa fa-cog fa-spin fa-fw"></i>
    </button>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
  isBusy: boolean = false; // flags if a previous button action is in progress
  rowData: any; // object including the data values for the row this cell belongs to

  agInit(params: any): void {
    this.rowData = params.data;
    this.reset();
  }

  onDeleteSubmission() {
    this.isBusy = true;

    if (this.rowData) {
      this.rowData.onDelete(this.rowData.accno, this.reset.bind(this), this.rowData.isTemp);
    }

  }

  onEditSubmission() {
    if (this.rowData) {
      this.rowData.onEdit(this.rowData.accno);
    }
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
   * Reverts the button to its original state
   */
  reset() {
    this.isBusy = false;
  }
}

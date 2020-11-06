import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'st-action-buttons-cell',
  template: `
    <div class="btn-group btn-group-sm" role="group" aria-label="Study actions">
      <button *ngIf="rowData && isRowEditable" type="button" class="btn btn-primary"
          (click)="onEditSubmission()"
          tooltip="Edit this submission"
          placement="left"
          container="body">
        <i class="fas fa-pencil-alt fa-fw"></i>
      </button>
      <button *ngIf="rowData && isRowDeletable" type="button" class="btn btn-danger"
          [disabled]="isBusy"
          (click)="onDeleteSubmission()"
          tooltip="Delete this submission"
          placement="left"
          container="body">
        <i *ngIf="!isBusy" class="fas fa-trash-alt fa-fw"></i>
        <i *ngIf="isBusy" class="fa fa-cog fa-spin fa-fw"></i>
      </button>
    </div>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
  isBusy: boolean = false; // flags if a previous button action is in progress
  rowData: any; // object including the data values for the row this cell belongs to

  get isRowDeletable(): boolean {
    return this.rowData.isDeletable;
  }

  get isRowEditable(): boolean {
    return this.rowData.isEditable;
  }

  agInit(params: any): void {
    this.rowData = params.data;
    this.reset();
  }

  onDeleteSubmission(): void {
    this.isBusy = true;

    if (this.rowData) {
      this.rowData.onDelete(this.rowData.accno, this.reset.bind(this), this.rowData.isTemp);
    }
  }

  onEditSubmission(): void {
    if (this.rowData) {
      this.rowData.onEdit(this.rowData.accno);
    }
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
   * Reverts the button to its original state
   */
  reset(): void {
    this.isBusy = false;
  }
}

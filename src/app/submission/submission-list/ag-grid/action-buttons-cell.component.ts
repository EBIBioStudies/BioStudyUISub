import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'st-action-buttons-cell',
  template: `
    <button
      *ngIf="rowData && !rowData.isTemp && !isProcessing"
      type="button"
      class="btn btn-link"
      (click)="onViewSubmission()"
      tooltip="Open in BioStudies"
      placement="left"
      container="body"
      triggers="hover"
    >
      <i class="fas fa-external-link-alt"></i>
    </button>
    <button
      *ngIf="rowData && isRowEditable"
      type="button"
      class="btn btn-link"
      (click)="onEditSubmission()"
      tooltip="Edit"
      placement="left"
      container="body"
      triggers="hover"
    >
      <i class="fas fa-pencil-alt"></i>
    </button>
    <button
      *ngIf="rowData && isRowDeletable"
      type="button"
      class="btn btn-link"
      [disabled]="isBusy"
      (click)="onDeleteSubmission()"
      tooltip="Delete"
      placement="left"
      container="body"
    >
      <i *ngIf="!isBusy" class="far fa-trash-alt fa-fw"></i>
      <i *ngIf="isBusy" class="fa fa-cog fa-spin fa-fw"></i>
    </button>
  `
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

  get isProcessing(): boolean {
    return this.rowData.isProcessing;
  }

  get deleteTooltip(): string {
    return 'Delete ' + this.rowData.accno;
  }

  get editTooltip(): string {
    return 'Edit ' + this.rowData.accno;
  }

  get viewTooltip(): string {
    return 'View ' + this.rowData.accno + ' in BioStudies';
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

  onViewSubmission(): void {
    if (this.rowData) {
      this.rowData.onView(this.rowData.accno);
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

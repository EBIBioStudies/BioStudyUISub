import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { FileUpload } from '../../shared/file-upload-list.service';

@Component({
  selector: 'st-file-actions-cell',
  template: `
    <div class="btn-group btn-group-sm" role="group" attr.aria-label="File actions">
      <button
        *ngIf="canDownload"
        type="button"
        class="btn btn-primary"
        tooltip="Download"
        container="body"
        placement="left"
        (click)="onFileDownload($event)"
        attr.aria-label="Download file"
        title="Download file"
      >
        <i aria-hidden="true" class="fas fa-download fa-fw"></i>
      </button>
      <button
        *ngIf="canRemove"
        type="button"
        class="btn btn-danger"
        tooltip="Delete"
        container="body"
        placement="left"
        (click)="onFileRemove($event)"
        attr.aria-label="Delete file"
        title="Delete file"
      >
        <i aria-hidden="true" class="fas fa-trash-alt fa-fw"></i>
      </button>
      <button
        *ngIf="canCancel"
        type="button"
        class="btn btn-warning"
        tooltip="Cancel"
        container="body"
        placement="left"
        (click)="onCancelUpload($event)"
        attr.aria-label="Cancel upload"
        title="Cancel upload"
      >
        Cancel
      </button>
    </div>
  `
})
export class FileActionsCellComponent implements AgRendererComponent {
  readonly canDeleteTypes = ['FILE', 'ARCHIVE', 'DIR'];
  private onDownload;
  private onRemove;
  private type?: string;
  private upload?: FileUpload;

  agInit(params: any): void {
    this.type = params.data.type;
    this.upload = params.data.upload;
    this.onRemove = params.data.onRemove || (() => {});
    this.onDownload = params.data.onDownload || (() => {});
  }

  get canRemove(): boolean {
    return !this.canCancel && this.canDeleteTypes.some((type) => type === this.type);
  }

  get canCancel(): boolean {
    return (this.upload && !this.upload.isFinished()) === true;
  }

  get canDownload(): boolean {
    return Boolean(this.type === 'FILE' && !this.upload?.isUploading());
  }

  get hasFailed(): boolean {
    return this.upload?.isFailed() || false;
  }

  onCancelUpload(ev): void {
    ev.preventDefault();
    if (this.upload) {
      this.upload.cancel();
    }
  }

  onFileDownload(event): void {
    event.preventDefault();
    this.onDownload();
  }

  onFileRemove(ev): void {
    ev.preventDefault();
    this.onRemove();
  }

  refresh(): boolean {
    return false;
  }
}

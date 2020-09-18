import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { FileUpload } from '../../shared/file-upload-list.service';

@Component({
  selector: 'st-file-actions-cell',
  template: `
    <div class="btn-group">
      <button *ngIf="canDownload"
          type="button"
          class="btn btn-primary btn-xs btn-flat"
          tooltip="Download"
          container="body"
          placement="bottom"
          (click)="onFileDownload($event)">
        <i class="fas fa-download fa-fw"></i>
      </button>
      <button *ngIf="canRemove"
          type="button"
          class="btn btn-danger btn-xs btn-flat"
          tooltip="Delete"
          container="body"
          placement="bottom"
          (click)="onFileRemove($event)">
        <i class="fas fa-trash-alt fa-fw"></i>
      </button>
      <button *ngIf="canCancel"
          type="button" class="btn btn-warning btn-xs"
          tooltip="Cancel"
          container="body"
          placement="bottom"
          (click)="onCancelUpload($event)">
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
    return this.type === 'FILE';
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

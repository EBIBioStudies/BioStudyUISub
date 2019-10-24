import { AgRendererComponent } from 'ag-grid-angular/src/interfaces';
import { Component } from '@angular/core';
import { FileUpload } from '../../shared/file-upload-list.service';

@Component({
    selector: 'st-file-actions-cell',
    template: `
        <div style="text-align:center">
            <button *ngIf="canDownload"
                    type="button"
                    class="btn btn-primary btn-xs btn-flat"
                    tooltip="Download"
                    (click)="onFileDownload($event)">
                <i class="fas fa-download fa-fw"></i>
            </button>
            <button *ngIf="canRemove"
                    type="button"
                    class="btn btn-danger btn-xs btn-flat"
                    tooltip="Delete"
                    (click)="onFileRemove($event)">
                <i class="fas fa-trash-alt fa-fw"></i>
            </button>
            <button *ngIf="canCancel"
                    type="button" class="btn btn-warning btn-xs"
                    tooltip="Cancel"
                    (click)="onCancelUpload($event)">
                Cancel
            </button>
        </div>
    `
})

export class FileActionsCellComponent implements AgRendererComponent {
    readonly canDeleteTypes = ['FILE', 'ARCHIVE', 'DIR'];
    private type?: string;
    private upload?: FileUpload;
    private onRemove;
    private onDownload;

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

    onFileRemove(ev) {
        ev.preventDefault();
        this.onRemove();
    }

    onFileDownload(event) {
        event.preventDefault();
        this.onDownload();
    }

    onCancelUpload(ev) {
        ev.preventDefault();
        if (this.upload) {
            this.upload.cancel();
        }
    }

    refresh(): boolean {
        return false;
    }
}

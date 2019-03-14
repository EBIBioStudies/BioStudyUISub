import {AgRendererComponent} from 'ag-grid-angular/src/interfaces';
import {Component} from '@angular/core';
import {FileUpload} from '../../shared/file-upload-list.service';

@Component({
    selector: 'file-actions-cell',
    template: `
        <div style="text-align:center">
            <button *ngIf="canRemove"
                    type="button" class="btn btn-danger btn-xs btn-flat"
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
    private type?: string;
    private upload?: FileUpload;
    private onRemove;

    agInit(params: any): void {
        this.type = params.data.type;
        this.upload = params.data.upload;
        this.onRemove = params.data.onRemove || (() => {
        });
    }

    get canRemove(): boolean {
        return !this.canCancel && (this.type === 'FILE' || this.type === 'ARCHIVE')
    }

    get canCancel(): boolean {
        return (this.upload && !this.upload.isFinished()) === true;
    }

    onFileRemove(ev) {
        ev.preventDefault();
        this.onRemove();
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